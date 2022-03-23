import {html, render} from '../../node_modules/lit-html/lit-html.js';
import { allProducts } from './allProducts.js';
let section = document.getElementById("home-page");
let urlGetProduct = "http://localhost:8000/products/get/";
let urlupdateProduct = "http://localhost:8000/products/update/";
let pagination = document.getElementById("pagination");
let dropdown = document.getElementById("dropdown");

const updateProductTemplate = (nameIsBusy, successfulAdded, resData, fieldData, product) => html`
  <form class="text-center border border-light p-5" method="POST">
           ${successfulAdded ? html`<h4 class="badge-warning rounded">"Successful Updated Product: ${resData.name}"</h4>` : null}
            <h1>Update product</h1>
            <div class="form-group">
                <label for="name">Product Name</label>
                <input id="name" type="text" class="form-control" placeholder="Name" name="name" .value=${product.name}>
              ${fieldData.name.length != 0 ? html`<small class="bg-danger rounded">${fieldData.name}</small>` : null}
               ${nameIsBusy ? html`<small class="bg-danger rounded">This product is already exists!!!</small>` : null}
            </div>
            <div class="form-group">
                <label for="category">Product Category</label>
                <input id="category" type="text" class="form-control" placeholder="Category" name="category" .value=${product.category}>
              ${fieldData.category.length != 0 ? html`<small class="bg-danger rounded">${fieldData.category}</small>` : null}
            </div>
            <div class="form-group">
                <label for="description">Product Description</label>
                <textarea id="description" class="form-control" placeholder="Description" name="description" .value=${product.description}></textarea>
               ${fieldData.description.length != 0 ? html`<small class="bg-danger rounded">${fieldData.description}</small>` : null}
            </div>
            <div class="form-group">
                <label for="quantity">Product Quantity</label>
                <input id="quantity" type="number" class="form-control" placeholder="Quantity" name="quantity" .value=${product.quantity}>
               ${fieldData.quantity.length != 0 ? html`<small class="bg-danger rounded">${fieldData.quantity}</small>` : null}
            </div>
            <div class="form-group">
                <label for="createdDate">Created date</label>
                <input id="createdDate" type="date" class="form-control" placeholder="Created date"  name="createdDate" .value=${product.createdDate}>
              ${fieldData.createdDate.length != 0 ? html`<small class="bg-danger rounded">${fieldData.createdDate}</small>` : null}
            </div>
            <div class="form-group">
                <label for="lastModifiedDate">Last modified date</label>
                <input id="lastModifiedDate" type="date" class="form-control" placeholder="Last modified date" name="lastModifiedDate" .value=${product.lastModifiedDate}>
               ${fieldData.lastModifiedDate.length != 0 ? html`<small class="bg-danger rounded">${fieldData.lastModifiedDate}</small>` : null}
            </div>
            <button id="updateBtn" type="submit" class="btn btn-primary">Submit</button>
        </form>
`;

export async function updateProduct(id) {
    let nameIsBusy = false;
    let successfulAdded = false;
    let resProduct = await fetch(urlGetProduct + id);
    let product = await resProduct.json();
    pagination.style.display = "none";
    dropdown.style.display = "none";

    let fieldData = {
        name: [],
        category: [],
        description: [],
        quantity: [],
        createdDate: [],
        lastModifiedDate: [],
  }
    let resData = "";
    render (updateProductTemplate(nameIsBusy, successfulAdded, resData, fieldData, product), section)
    let name = document.getElementById("name");
    let category = document.getElementById("category");
    let description = document.getElementById("description");
    let quantity = document.getElementById("quantity");
    let createdDate = document.getElementById("createdDate");
    let lastModifiedDate = document.getElementById("lastModifiedDate");
    let updateBtn = document.getElementById("updateBtn");
    updateBtn.addEventListener("click", updateProductConfirm);

   async  function updateProductConfirm(event) {
   event.preventDefault();
   nameIsBusy = false;
   successfulAdded = false;
   fieldData = {
           name: [],
           category: [],
           description: [],
           quantity: [],
           createdDate: [],
           lastModifiedDate: [],
     }

      resData = "";
    let data = {
        name: name.value,
        category: category.value,
        description: description.value,
        quantity: quantity.value,
        createdDate: createdDate.value,
        lastModifiedDate: lastModifiedDate.value
               }

               const option = {
                method: "put",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
                           }
    try {
        const res = await fetch(urlupdateProduct + id, option);
         if(res.status == 226){
             nameIsBusy = true;
             resData = await res.json();
             render (updateProductTemplate(nameIsBusy, successfulAdded, resData, fieldData, product), section)
              }
              if(res.status == 400){
              resData = await res.json();
              let yyy = resData;
              
                for(let item in resData){
                    let field = resData[item].field;
                    fieldData[field].push(resData[item].defaultMessage);
                  }
                 render (updateProductTemplate(nameIsBusy, successfulAdded, resData, fieldData, product), section)
              }
        if(res.status != 200 && res.status != 226 && res.status != 400){
            throw new Error("Invalid request!!!");
        }
          if(res.status == 200){
                     resData = await res.json();
    //    name.value = "";
    //    category.value = "";
    //    description.value = "";
    //    quantity.value = "";
    //    createdDate.value = "";
    //    lastModifiedDate.value = "";
    //    successfulAdded = true;
        //  render (updateProductTemplate(nameIsBusy, successfulAdded, resData, fieldData, product), section);
      allProducts(event);
             }

    } catch (error) {
        alert(error.message);
    }
  }
}