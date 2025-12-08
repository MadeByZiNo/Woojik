package com.madebyzino.Woojik.dto.sale;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class SaleRequest {
    private LocalDate saleDate;
    private Long price;
    private String customerName;
    private Double weight;
    private String grade;
    private String notes;
}