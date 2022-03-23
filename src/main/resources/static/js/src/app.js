import { allProducts } from "./view/allProducts.js";
import { allCategories } from  "./view/allCategory.js"
import { addProduct } from  "./view/addProduct.js"

let allProductsBtn = document.querySelector("#allProducts");
allProductsBtn.addEventListener("click", allProducts);

let allCategoryBtn = document.querySelector("#allCategory");
allCategoryBtn.addEventListener("click", allCategories);

let addProductBtn = document.querySelector("#addProduct");
addProductBtn.addEventListener("click", addProduct);

