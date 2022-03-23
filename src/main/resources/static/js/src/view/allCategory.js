import {html, render} from '../../node_modules/lit-html/lit-html.js'
let section = document.getElementById("home-page");
let url = "http://localhost:8000/categories/getAllCategory";
let dropdown = document.getElementById("dropdown");
let pagination = document.getElementById("pagination");

const allCategoriesTemplate = (categories) => html`
<h1 class="text-center">Categories: ${categories.length}</h1>
<div  class=" mt-3 ">
    <div class="row d-flex d-wrap">
${categories.map(categoryCard)}
    </div>
</div>`;

const categoryCard = (category) => html`
                  <div class="card-deck d-flex justify-content-center">
                      <div class="card mb-4" >
                         <div class="card-body">
                             <h4 class="card-title">${category.category}</h4>
                         </div>
                         <div class="card">
                             <p>ProductsAvailable: ${category.productsAvailable}</p>
                         </div>
                      </div>
                   </div>
`;


export async function allCategories(event) {
    event.preventDefault();
    dropdown.style.display = "none";
    pagination.style.display = "none";
    try {
        const res = await fetch(url);
        if(res.status != 200){
            throw new Error("Invalid request!!!");
        }
       const resData = await res.json();
       render (allCategoriesTemplate(resData), section)


    } catch (error) {
        alert(error.message);
    }
}
