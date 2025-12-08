package com.madebyzino.Woojik.dto.breeding;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BreedingAiRequest {
    private LocalDate date;
    private String sireCode;
    private String notes;
}