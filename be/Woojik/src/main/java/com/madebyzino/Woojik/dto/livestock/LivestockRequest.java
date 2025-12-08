package com.madebyzino.Woojik.dto.livestock;

import com.madebyzino.Woojik.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LivestockRequest {
    private String earTag;       // 귀표번호
    private String name;         // 이름
    private LocalDate birthDate; // 생일
    private Gender gender;       // 성별
    private String breed;        // 품종
    private Long penId;          // 축사 칸 ID (초기 입식 위치)
    // private MultipartFile image; // 사진 업로드는 별도 로직으로 뺍니다 (일단 제외)
}