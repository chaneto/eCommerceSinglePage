import {html, render} from '../../node_modules/lit-html/lit-html.js';
import { updateProduct } from './update.js';
let section = document.getElementById("home-page");
let url = "http://localhost:8000/products/allProducts/";
let urlGetAllProducts = "http://localhost:8000/products/get";
let urlDelete = "http://localhost:8000/products/delete/";
let urlBuytProduct = "http://localhost:8000/products/buy/";
let dropdown = document.getElementById("dropdown");
let nameAsc = document.getElementById("nameAsc");
let nameDesc = document.getElementById("nameDesc");
let categoryAsc = document.getElementById("categoryAsc");
let categoryDesc = document.getElementById("categoryDesc");
let dateAsc = document.getElementById("dateAsc");
let dateDesc = document.getElementById("dateDesc");
let pagination = document.getElementById("pagination");
let pageNumber = document.getElementById("pageNumber");
let previous = document.getElementById("previous");
let next = document.getElementById("next");
let pegaNumberCurrent = 1;
let allPages = 0;
let errorFromBindingResult = [];
let currentId = "";
let orderBy = "name";
let allProduct = "";

const allProductsTemplate = (products, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId) => html`
<h1 class="text-center">Products: ${products.totalRecords}</h1>
<div  class=" mt-3 ">
    <div class="row d-flex d-wrap">
${products.products.map(p => productCard(p, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId))}
    </div>
</div>

`;

const productCard = (product, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId) => html`
                <div class="card-deck d-flex justify-content-center">
                    <div class="card mb-4" >
                        <div class="card-body">
                            <h4 class="card-title">${product.name}</h4>
                        </div>
                        <div class="card">
                            <p>${product.category}</p>
                        </div>
                        <div class="card">
                            <p>${product.description}</p>
                        </div>
                        <div class="card">
                            <p>${product.quantity}</p>
                        </div>
                        <div class="card">
                            <p>${product.createdDate}</p>
                        </div>
                        <div class="card" id="details">
                            <p>${product.lastModifiedDate}</p>
                        </div>
                        <div class="card-footer">
                            <form method="POST" >
                                <div id="quantity-form">
                                    <div class="col">
                                        <input name="quantity" id="quantity" type="number" class="form-control" placeholder="Select Quantity"></input>
                                      ${errorFromBindingResult.length != ""  && currentId == product.id? html`<small id="quantityError" class="form-text bg-danger rounded">${errorFromBindingResult}</small>` : null} 
                                        <h7 class="form-text bg-danger rounded"></h7>
                                      <!--  <h7 class="form-text bg-danger rounded">Quantity buy cannot be null!!!</h7>
                                        <h7 class="form-text bg-danger rounded">Тhe quantity buy cannot be a negative value or zero!!!</h7> -->
                                    </div>
                                </div>
                                <a>
                                    <button @click=${onUpdate}  type="button" .value=${product.id} class="btn btn-info">Update</button>
                                </a>
                                <a>
                                    <button id="deleteBtn" @click=${onDelete}  .value=${product.id}  type="button" class="btn btn-info">Delete</button>
                                </a>
                                <a>
                                    <button  @click=${onBuy} type="submit" .value=${product.id} class="btn btn-info">Buy</button>
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
`;


export async function allProducts(event) {

    event.preventDefault();
    pegaNumberCurrent = pageNumber.textContent;
    allPages = await gelAllPages();

    dropdown.style.display = "block";
    pagination.style.display = "block";

     await viewProducts(orderBy, pegaNumberCurrent - 1);

     nameAsc.addEventListener("click", orderByNameAsc);
     function orderByNameAsc(){
     orderBy = "name";
     viewProducts(orderBy, pegaNumberCurrent - 1);
     }

     nameDesc.addEventListener("click", orderByNameDesc);
          function orderByNameDesc(){
          orderBy = "nameDesc";
          viewProducts(orderBy, pegaNumberCurrent - 1);
          }

     categoryAsc.addEventListener("click", orderByCategoryAsc);
          function orderByCategoryAsc(){
          orderBy = "category";
          viewProducts(orderBy, pegaNumberCurrent - 1);
          }

     categoryDesc.addEventListener("click", orderByCategoryDesc);
          function orderByCategoryDesc(){
          orderBy = "categoryDesc";
          viewProducts(orderBy, pegaNumberCurrent - 1);
          }

     dateAsc.addEventListener("click", orderByDateAsc);
          function orderByDateAsc(){
          orderBy = "createdDate";
          viewProducts(orderBy, pegaNumberCurrent - 1);
          }

     dateDesc.addEventListener("click", orderByDateDesc);
          function orderByDateDesc(){
          orderBy = "createdDateDesc";
          viewProducts(orderBy, pegaNumberCurrent - 1);
          }

 }

   async function onBuy(b) {
       b.preventDefault();
       errorFromBindingResult = [];
       let id = b.target.getAttribute("value");
       let quantity  = b.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.children[0].children[0];

       const data = {
       quantityBuy: quantity.value
       }

       const option = {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
                   }
       try {
           const res = await fetch(urlBuytProduct + id, option);
           let resDataUpdate = "";
           if(res.status == 200){
            quantity.value = "";
            allProducts(b);
           }
           else if(res.status == 400){
               resDataUpdate = await res.json();
               currentId = id;
               for(let item in resDataUpdate){
                   errorFromBindingResult.push(resDataUpdate[item].defaultMessage);
               }
               render (allProductsTemplate(resData, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId), section);
           }
           else if(res.status == 226){
            resDataUpdate = await res.text();
            errorFromBindingResult.push(resDataUpdate);
            currentId = id;
            render (allProductsTemplate(resData, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId), section);
           }else{
               throw new Error("Invalid request!!!");
           }

       } catch (error) {
           alert(error.message);
       }
 }

   async function onUpdate(u) {
       u.preventDefault();
       updateProduct(u.target.getAttribute("value"));
   }


   async function onDelete(e) {
       e.preventDefault();
       let id = e.target.getAttribute("value");
       const option = {
           method: "delete",
           headers: {"Content-Type": "application/json"}
                      }
           try {
               const res = await fetch(urlDelete + id, option);
               if(res.status != 200){
                   throw new Error("Invalid request!!!")
               }
               allProducts(e);
           } catch (error) {
               alert(error.message);
           }
       }


   async function gelAllPages(){
        try {
           let res = await fetch(urlGetAllProducts);
               if(res.status != 200){
                 throw new Error("Invalid request!!!");
                  }
               allProduct = await res.json();
               allPages = Math.ceil(allProduct.length / 3);
                    return allPages;
                } catch (error) {
                      alert(error.message);
                }
        }

   previous.addEventListener("click", onPrevious);
     function onPrevious(prev){
            prev.preventDefault();
            pegaNumberCurrent = Number(pageNumber.textContent) - 1;
                 if(allPages == 0 || pegaNumberCurrent <= 1){
                       previous.style.display = "none";
                   }else{
                       previous.style.display = "block";
                        }
                       pageNumber.textContent =  pegaNumberCurrent;
                       next.style.display = "block";
                       viewProducts(orderBy, pegaNumberCurrent - 1);
                    }

next.addEventListener("click", onNext);
    function onNext(nex){
       nex.preventDefault();
       pegaNumberCurrent = Number(pageNumber.textContent) + 1;
        if(pegaNumberCurrent > allPages - 1){
            next.style.display = "none";
        }else{
            next.style.display = "block";
             }
            pageNumber.textContent =  pegaNumberCurrent;
            previous.style.display = "block";
            viewProducts(orderBy, pegaNumberCurrent - 1);
             }


async function viewProducts(orderByInput, input){
       try {
          const res = await fetch(url + orderByInput + "/" + input);
              if(res.status != 200){
                throw new Error("Invalid request!!!");
                    }
                 const resData = await res.json();
                 pageNumber.textContent =  pegaNumberCurrent;
                 render (allProductsTemplate(resData, onDelete, onUpdate, onBuy, errorFromBindingResult, currentId), section);
                    } catch (error) {
                           alert(error.message);
                       }

                  }
               


