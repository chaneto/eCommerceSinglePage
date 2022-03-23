package com.example.eCommerceSinglePage.repositories;

import com.example.eCommerceSinglePage.model.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    ProductEntity findByName(String name);

    @Query("select p from ProductEntity as p where p.id = :id")
    ProductEntity getById(@Param("id") Long id);

    @Query("select p.category, count(p.id) from ProductEntity as p group by p.category order by count(p.id)")
    List<String[]> getAllCategory();

    void deleteById(Long id);

    @Modifying
    @Transactional
    @Query("update ProductEntity as p set p.name = :name, p.category = :category," +
            " p.description = :description, p.quantity = :quantity, p.createdDate = :createdDate, " +
            "p.lastModifiedDate = :lastModifiedDate  where p.id = :id")
    void updateProduct(@Param("name") String name, @Param("category") String category,
                       @Param("description") String description, @Param("quantity")BigDecimal quantity,
                       @Param("createdDate")LocalDate createdDate, @Param("lastModifiedDate") LocalDate lastModifiedDate,
                       @Param("id") Long id);

    @Modifying
    @Transactional
    @Query("update ProductEntity as p set p.quantity = :quantity where p.id = :id")
    void setQuantity(@Param("quantity")BigDecimal quantity, @Param("id") Long id);

    Page<ProductEntity> findAll(Pageable pageable);

    List<ProductEntity> findAll();
}
