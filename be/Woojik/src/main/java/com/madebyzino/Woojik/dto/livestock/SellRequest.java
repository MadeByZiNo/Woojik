package com.madebyzino.Woojik.dto.livestock;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SellRequest {
    private LocalDate date;    // 출하일
    private Long price;        // 판매 금액
    private String customer;   // 거래처/도축장
    private String grade;      // 등급 (1++, 1+ 등)
    private String reason;     // 출하 사유 (판매, 도태, 폐사)
}