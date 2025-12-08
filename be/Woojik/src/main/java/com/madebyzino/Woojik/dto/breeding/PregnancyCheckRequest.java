package com.madebyzino.Woojik.dto.breeding;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PregnancyCheckRequest {
    private LocalDate date;      // 감정일
    private boolean isPregnant;  // 임신 여부
    private String notes;        // 비고 (수의사 소견 등)
}