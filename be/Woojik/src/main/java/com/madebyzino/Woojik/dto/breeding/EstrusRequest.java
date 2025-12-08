package com.madebyzino.Woojik.dto.breeding;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EstrusRequest {
    private LocalDate date;
    private String notes;
}