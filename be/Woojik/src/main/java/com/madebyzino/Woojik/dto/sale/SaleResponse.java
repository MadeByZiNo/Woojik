package com.madebyzino.Woojik.dto.sale;

import com.madebyzino.Woojik.entity.Sale;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class SaleResponse {
    private Long id;
    private Long livestockId;
    private String earTag;
    private LocalDate saleDate;
    private Long price;
    private String customerName;
    private Double weight;
    private String grade;
    private String notes;
    private LocalDate birthDate;
    private String breed; // 품종

    public SaleResponse(Sale sale) {
        this.id = sale.getId();
        this.livestockId = sale.getLivestock().getId();
        this.earTag = sale.getLivestock().getEarTag();
        this.saleDate = sale.getSaleDate();
        this.price = sale.getPrice();
        this.customerName = sale.getCustomerName();
        this.weight = sale.getWeight();
        this.grade = sale.getGrade();
        this.notes = sale.getNotes();
        this.birthDate = sale.getLivestock().getBirthDate();
        this.breed = sale.getLivestock().getBreed();
    }
}