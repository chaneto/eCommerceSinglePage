package com.example.eCommerceSinglePage.web;

import com.example.eCommerceSinglePage.model.views.CategoryViewModel;
import com.example.eCommerceSinglePage.services.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/getAllCategory")
    public ResponseEntity<List<CategoryViewModel>> getAllCategory(){
        List<CategoryViewModel> categories = this.categoryService.getAllCategory();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

}
