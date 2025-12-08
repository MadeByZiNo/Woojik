package com.madebyzino.Woojik.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "sales")
public class Sale extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livestock_id", unique = true)
    private Livestock livestock;

    private LocalDate saleDate;
    private Long price;
    private String customerName;
    private Double weight;
    private String grade;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder
    public Sale(Livestock livestock, LocalDate saleDate, Long price, String customerName, Double weight, String grade, String notes) {
        this.livestock = livestock;
        this.saleDate = saleDate;
        this.price = price;
        this.customerName = customerName;
        this.weight = weight;
        this.grade = grade;
        this.notes = notes;
    }
}