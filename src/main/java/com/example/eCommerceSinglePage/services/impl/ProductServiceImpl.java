package com.example.eCommerceSinglePage.services.impl;

import com.example.eCommerceSinglePage.model.bindings.ProductAddBindingModel;
import com.example.eCommerceSinglePage.model.entities.ProductEntity;
import com.example.eCommerceSinglePage.model.serviceModels.ProductServiceModel;
import com.example.eCommerceSinglePage.model.views.ProductViewModel;
import com.example.eCommerceSinglePage.repositories.ProductRepository;
import com.example.eCommerceSinglePage.services.ProductService;
import com.google.gson.Gson;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static ch.qos.logback.core.joran.spi.ConsoleTarget.findByName;

@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ModelMapper mapper;
    private final Gson gson;
    private final Resource productFile;

    public ProductServiceImpl(ProductRepository productRepository, ModelMapper mapper, Gson gson
            ,@Value("classpath:init/products.json") Resource productFile) {
        this.productRepository = productRepository;
        this.mapper = mapper;
        this.gson = gson;
        this.productFile = productFile;
    }

    @Override
    public void seedProductsFromJson() throws IOException {
        if(this.productRepository.count() == 0){
            ProductAddBindingModel[] products = this.gson.fromJson(Files.readString(Path.of(productFile.getURI())), ProductAddBindingModel[].class);
            for(ProductAddBindingModel product: products){
                if(findByName(product.getName()) == null){
                    seedProduct(this.mapper.map(product, ProductServiceModel.class));
                }
            }
        }
    }

    @Override
    public int getAllProductCount() {
        return (int) this.productRepository.count();
    }

    @Override
    public void setQuantity(BigDecimal quantity, Long id) {
        BigDecimal newQuantity = getById(id).getQuantity().subtract(quantity);
        this.productRepository.setQuantity(newQuantity, id);
    }

    @Override
    public ProductEntity seedProduct(ProductServiceModel productServiceModel){
        ProductEntity productEntity = this.mapper.map(productServiceModel, ProductEntity.class);
        try {
            this.productRepository.save(productEntity);
            return productEntity;
        }catch (Exception e){
            throw new DataIntegrityViolationException(e.getMessage());
        }


    }

    @Override
    public boolean productIsExists(String name) {
        return this.productRepository.findByName(name) != null;
    }

    @Override
    public ProductViewModel getById(Long id){
        return this.mapper.map(this.productRepository.getById(id), ProductViewModel.class);
    }

    @Override
    public void deleteProductById(Long id) {
        this.productRepository.deleteById(id);
    }


    @Override
    public void updateProduct(ProductServiceModel product, Long id) {
           this.productRepository.updateProduct(product.getName(), product.getCategory(), product.getDescription(),
                   product.getQuantity(), product.getCreatedDate(), product.getLastModifiedDate(), id);
    }

    @Override
    public List<ProductViewModel> findAllProductsWithOutPagination() {
        return conversionToListViewModel(this.productRepository.findAll());
    }

    @Override
    public List<ProductViewModel> getAllProducts(Integer pageNo, Integer pageSize, Sort sort) {
        Pageable paging = PageRequest.of(pageNo, pageSize, sort);

        Page<ProductEntity> pagedResult = this.productRepository.findAll(paging);

        if(pagedResult.hasContent()) {
            return conversionToListViewModel(pagedResult.getContent());
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public boolean quantityIsEnough(Long id, BigDecimal quantityBuy){
        BigDecimal productQuantity = getById(id).getQuantity();
        boolean result = false;
        int compare = productQuantity.compareTo(quantityBuy);
        if(compare == 0){
            result = true;
        }else if(compare == 1){
            result = true;
        }
       return  result;
    }

    public List<ProductViewModel> conversionToListViewModel(List<ProductEntity> products){
        List<ProductViewModel> productsViews = new ArrayList<>();
        for(ProductEntity product : products){
            ProductViewModel productViewModel = this.mapper.map(product, ProductViewModel.class);
            productsViews.add(productViewModel);
        }
        return productsViews;
    }


}
