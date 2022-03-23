package com.example.eCommerceSinglePage.model.views;

import java.util.List;

public class ProductRestViewModel {

    private List<ProductViewModel> products;
    private int  totalRecords;

    public ProductRestViewModel() {
    }

    public ProductRestViewModel(List<ProductViewModel> products, int totalRecords) {
        this.products = products;
        this.totalRecords = totalRecords;
    }

    public List<ProductViewModel> getProducts() {
        return products;
    }

    public void setProducts(List<ProductViewModel> products) {
        this.products = products;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }
}
