import {html, render} from '../../node_modules/lit-html/lit-html.js'
let section = document.getElementById("home-page");
let url = "http://localhost:8000/products/add";
let dropdown = document.getElementById("dropdown");
let pagination = document.getElementById("pagination");

const addProductTemplate = (nameIsBusy, successfulAdded, resData, fieldData) => html`
  <form class="text-center border border-light p-5" method="POST">
           ${successfulAdded ? html`<h4 class="badge-warning rounded">"Successful Added Product: ${resData.name}"</h4>` : null}
            <h1>Add product</h1>
            <div class="form-group">
                <label for="name">Product Name</label>
                <input id="name" type="text" class="form-control" placeholder="Name" name="name" value="">
              ${fieldData.name.length != 0 ? html`<small class="bg-danger rounded">${fieldData.name}</small>` : null}
               ${nameIsBusy ? html`<small class="bg-danger rounded">This product is already exists!!!</small>` : null}
            </div>
            <div class="form-group">
                <label for="category">Product Category</label>
                <input id="category" type="text" class="form-control" placeholder="Category" name="category" value="">
              ${fieldData.category.length != 0 ? html`<small class="bg-danger rounded">${fieldData.category}</small>` : null}
            </div>
            <div class="form-group">
                <label for="description">Product Description</label>
                <textarea id="description" class="form-control" placeholder="Description" name="description"></textarea>
               ${fieldData.description.length != 0 ? html`<small class="bg-danger rounded">${fieldData.description}</small>` : null}
            </div>
            <div class="form-group">
                <label for="quantity">Product Quantity</label>
                <input id="quantity" type="number" class="form-control" placeholder="Quantity" name="quantity" value="">
               ${fieldData.quantity.length != 0 ? html`<small class="bg-danger rounded">${fieldData.quantity}</small>` : null}
            </div>
            <div class="form-group">
                <label for="createdDate">Created date</label>
                <input id="createdDate" type="date" class="form-control" placeholder="Created date"  name="createdDate" value="">
              ${fieldData.createdDate.length != 0 ? html`<small class="bg-danger rounded">${fieldData.createdDate}</small>` : null}
            </div>
            <div class="form-group">
                <label for="lastModifiedDate">Last modified date</label>
                <input id="lastModifiedDate" type="date" class="form-control" placeholder="Last modified date" name="lastModifiedDate" value="">
               ${fieldData.lastModifiedDate.length != 0 ? html`<small class="bg-danger rounded">${fieldData.lastModifiedDate}</small>` : null}
            </div>
            <button id="addBtn" type="submit" class="btn btn-primary">Submit</button>
        </form>
`;

export async function addProduct() {
    let nameIsBusy = false;
    let successfulAdded = false;
    dropdown.style.display = "none";
    pagination.style.display = "none";
    let fieldData = {
        name: [],
        category: [],
        description: [],
        quantity: [],
        createdDate: [],
        lastModifiedDate: [],
  }
    let resData = "";
    render (addProductTemplate(nameIsBusy, successfulAdded, resData, fieldData), section)
    let name = document.getElementById("name");
    let category = document.getElementById("category");
    let description = document.getElementById("description");
    let quantity = document.getElementById("quantity");
    let createdDate = document.getElementById("createdDate");
    let lastModifiedDate = document.getElementById("lastModifiedDate");
    let addBtn = document.getElementById("addBtn");
    addBtn.addEventListener("click", addProductConfirm);

   async  function addProductConfirm(event) {
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
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
                           }
    try {
        const res = await fetch(url, option);
         if(res.status == 226){
             nameIsBusy = true;
             resData = await res.json();
             render (addProductTemplate(nameIsBusy, successfulAdded, resData, fieldData), section)
              }
              if(res.status == 400){
              resData = await res.json();
             
                for(let item in resData){
                    let field = resData[item].field;
                    fieldData[field].push(resData[item].defaultMessage);
                  }
                 render (addProductTemplate(nameIsBusy, successfulAdded, resData, fieldData), section)
              }
        if(res.status != 201 && res.status != 226 && res.status != 400){
            throw new Error("Invalid request!!!");
        }
         if(res.status == 201){
                    resData = await res.json();
       name.value = "";
       category.value = "";
       description.value = "";
       quantity.value = "";
       createdDate.value = "";
       lastModifiedDate.value = "";
       successfulAdded = true;
        render (addProductTemplate(nameIsBusy, successfulAdded, resData, fieldData), section)
           }

    } catch (error) {
        alert(error.message);
    }
  }
}