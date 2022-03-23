package com.example.eCommerceSinglePage.web;

import com.example.eCommerceSinglePage.model.entities.ProductEntity;
import com.example.eCommerceSinglePage.repositories.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
