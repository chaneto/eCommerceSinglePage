package com.example.eCommerceSinglePage.model.entities;

import org.springframework.format.annotation.DateTimeFormat;
import javax.persistence.*;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @Size(min = 1)
    private String name;

    @Column(nullable = false)
    @Size(min = 1)
    private String category;

    @Column(columnDefinition = "TEXT")
    @Size(min = 10)
    private String description;

    @Column(nullable = false)
    @DecimalMin("0")
    private BigDecimal quantity;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Column(name = "last_modified_date")
    private LocalDate lastModifiedDate;

    public ProductEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDate getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDate lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}
