package com.madebyzino.Woojik.dto.breeding;

import com.madebyzino.Woojik.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CalvingRequest {
    private LocalDate date;      // 분만일

    // 송아지 정보
    private String calfEarTag;   // 송아지 귀표
    private String calfName;     // 송아지 이름
    private Gender calfGender;   // 성별
}