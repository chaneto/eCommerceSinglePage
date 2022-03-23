package com.example.eCommerceSinglePage.services;

import com.example.eCommerceSinglePage.model.views.ProductViewModel;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.junit4.SpringRunner;
import java.math.BigDecimal;
import org.springframework.data.domain.Sort;
import com.example.eCommerceSinglePage.model.entities.ProductEntity;
import com.example.eCommerceSinglePage.model.serviceModels.ProductServiceModel;
import com.example.eCommerceSinglePage.repositories.ProductRepository;
import java.time.LocalDate;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ProductServiceImplTest {


    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper mapper;

    ProductEntity productEntity1;
    ProductEntity productEntity3;
    ProductServiceModel productServiceModel;

    @Before
    public void setup(){
     this.productRepository.deleteAll();

     productEntity1 = new ProductEntity();
     productEntity1.setName("Toshiba crx");
     productEntity1.setCategory("Laptop");
     productEntity1.setDescription("Toshiba crx description...");
     productEntity1.setQuantity(BigDecimal.valueOf(33));
     productEntity1.setCreatedDate(LocalDate.of(2020, 11, 3));
     productEntity1.setLastModifiedDate(LocalDate.of(2021, 12, 3));
     this.productRepository.save(productEntity1);

     productEntity3 = new ProductEntity();
     productEntity3.setName("Apple");
     productEntity3.setCategory("Monitor");
     productEntity3.setDescription("Apple description...");
     productEntity3.setQuantity(BigDecimal.valueOf(3));
     productEntity3.setCreatedDate(LocalDate.of(2021, 3, 21));
     productEntity3.setLastModifiedDate(LocalDate.of(2022, 1, 1));
     this.productRepository.save(productEntity3);

     productServiceModel = new ProductServiceModel();
        productServiceModel.setName("Samsung");
        productServiceModel.setCategory("TV");
        productServiceModel.setDescription("Toshiba crx description...");
        productServiceModel.setQuantity(BigDecimal.valueOf(1));
        productServiceModel.setCreatedDate(LocalDate.of(2020, 11, 3));
        productServiceModel.setLastModifiedDate(LocalDate.of(2021, 12, 3));
    }

    @Test
    public void testSeedProduct(){
        this.productRepository.deleteAll();
        Assert.assertEquals(0, this.productRepository.count());
        this.productService.seedProduct(this.mapper.map(productEntity1, ProductServiceModel.class));
        this.productService.seedProduct(this.mapper.map(productEntity3, ProductServiceModel.class));
        Assert.assertEquals(2, this.productRepository.count());
    }

    @Test(expected = DataIntegrityViolationException.class)
    public void testSeedProductWithInvalidData(){
        this.productRepository.deleteAll();
        Assert.assertEquals(0, this.productRepository.count());
        productEntity1.setName("");
        this.productService.seedProduct(this.mapper.map(productEntity1, ProductServiceModel.class));
    }

    @Test
    public void getAllProductCount(){
        this.productRepository.deleteAll();
        Assert.assertEquals(0, this.productService.getAllProductCount());
        this.productRepository.save(productEntity1);
        this.productRepository.save(productEntity3);
        Assert.assertEquals(2, this.productService.getAllProductCount());
    }

    @Test
    public void testProductIsExists(){
        Assert.assertTrue(this.productService.productIsExists("Toshiba crx"));
        Assert.assertFalse(this.productService.productIsExists("Samsung"));
    }

    @Test
    public void testGetById(){
        Long productId = productEntity1.getId();
        ProductViewModel productViewModel = this.productService.getById(productId);
        Assert.assertEquals(productEntity1.getName(), productViewModel.getName());
        Assert.assertEquals(productEntity1.getQuantity().stripTrailingZeros(), productViewModel.getQuantity().stripTrailingZeros());
        Assert.assertEquals(productEntity1.getCategory(), productViewModel.getCategory());
    }

    @Test
    public void testDeleteProductById(){
        Long productId = productEntity1.getId();
        String productName = productEntity1.getName();
        Assert.assertEquals(2, this.productService.getAllProductCount());
        this.productService.deleteProductById(productId);
        Assert.assertEquals(1, this.productService.getAllProductCount());
        Assert.assertFalse(this.productService.productIsExists(productName));
    }

    @Test
    public void testUpdateProduct(){
        String newName = productServiceModel.getName();
        String newCategory = productServiceModel.getCategory();
        BigDecimal newQuantity = productServiceModel.getQuantity();
        Long id  = productEntity1.getId();
        Assert.assertEquals("Toshiba crx", this.productService.getById(id).getName());
        this.productService.updateProduct(productServiceModel, id);
        Assert.assertEquals(newName, this.productService.getById(id).getName());
        Assert.assertEquals(newCategory, this.productService.getById(id).getCategory());
        Assert.assertEquals(newQuantity.stripTrailingZeros(), this.productService.getById(id).getQuantity().stripTrailingZeros());
    }

    @Test
    public void testGetAllProducts(){
        Sort sort = Sort.by("name");
        List<ProductViewModel> products = this.productService.getAllProducts(0, 3, sort);
        Assert.assertEquals(this.productService.getAllProductCount(), products.size());
        Assert.assertEquals(productEntity3.getName(), products.get(0).getName());
        this.productRepository.deleteAll();
        products = this.productService.getAllProducts(0, 3, sort);
        Assert.assertTrue(products.isEmpty());
    }

    @Test
    public void testQuantityIsEnough(){
        BigDecimal quantityBuy = BigDecimal.valueOf(22);
        Long productId = productEntity1.getId();
        Assert.assertTrue(this.productService.quantityIsEnough(productId, quantityBuy));
    }

    @Test
    public void testQuantityIsEqualValue(){
        BigDecimal quantityBuy = BigDecimal.valueOf(33);
        Long productId = productEntity1.getId();
        Assert.assertTrue(this.productService.quantityIsEnough(productId, quantityBuy));
    }

    @Test
    public void testQuantityIsNotEnough(){
        BigDecimal quantityBuy = BigDecimal.valueOf(44);
        Long productId = productEntity1.getId();
        Assert.assertFalse(this.productService.quantityIsEnough(productId, quantityBuy));
    }

    @Test
    public void testSetQuantity(){
        BigDecimal quantityBuy = BigDecimal.valueOf(30);
        Long productId = productEntity1.getId();
        Assert.assertEquals(productEntity1.getQuantity(), BigDecimal.valueOf(33));
        this.productService.setQuantity(quantityBuy, productId);
        BigDecimal newQuantity = productEntity1.getQuantity().subtract(quantityBuy);
        Assert.assertEquals(BigDecimal.valueOf(3).stripTrailingZeros(), newQuantity.stripTrailingZeros());
    }

    @Test
    public void findAllProductsWithOutPagination(){
        List<ProductViewModel> products = this.productService.findAllProductsWithOutPagination();
        Assert.assertEquals(2, products.size());
    }

}
