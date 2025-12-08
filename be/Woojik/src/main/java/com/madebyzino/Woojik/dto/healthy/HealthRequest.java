package com.madebyzino.Woojik.dto.healthy;

import com.madebyzino.Woojik.entity.enums.HealthType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HealthRequest {
    private HealthType type;      // VACCINE(백신) 또는 TREAT(치료)
    private LocalDate date;       // 접종/진료일
    private String diseaseName;   // 병명
    private String medicine;      // 약품명
    private String description;   // 증상 및 처치 내용
    private Integer withdrawalPeriod; // 휴약기간
}