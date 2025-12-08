package com.madebyzino.Woojik.dto.livestock;

import com.madebyzino.Woojik.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LivestockUpdateRequest {
    private String name;         // 이름/별명 수정
    private Gender gender;       // 성별 수정 (MALE -> CASTRATED 등)
    private LocalDate birthDate; // 생일 정정
    private String breed;        // 품종 정정
    private String notes;        // 비고 수정
}