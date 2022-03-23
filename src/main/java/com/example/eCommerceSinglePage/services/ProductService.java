package com.example.eCommerceSinglePage.services;

import com.example.eCommerceSinglePage.model.entities.ProductEntity;
import com.example.eCommerceSinglePage.model.serviceModels.ProductServiceModel;
import com.example.eCommerceSinglePage.model.views.ProductViewModel;
import org.springframework.data.domain.Sort;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

public interface ProductService {

    int getAllProductCount();

    void seedProductsFromJson() throws IOException;

    void setQuantity(BigDecimal quantity, Long id);

    boolean quantityIsEnough(Long id, BigDecimal quantityBuy);

    ProductEntity seedProduct(ProductServiceModel productServiceModel);

    boolean productIsExists(String name);

    List<ProductViewModel> getAllProducts(Integer pageNo, Integer pageSize, Sort sort);

    ProductViewModel getById(Long id);

    void deleteProductById(Long id);

    void updateProduct(ProductServiceModel product, Long id);

    List<ProductViewModel> findAllProductsWithOutPagination();
}
