package com.madebyzino.Woojik.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {

    // 400 BAD_REQUEST
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),
    LIVESTOCK_NOT_SAFE_TO_SELL(HttpStatus.BAD_REQUEST, "휴약기간이 지나지 않았거나 치료 중인 가축은 판매할 수 없습니다."),

    // 404 NOT_FOUND
    LIVESTOCK_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 개체를 찾을 수 없습니다."),
    BARN_NOT_FOUND(HttpStatus.NOT_FOUND, "축사 정보를 찾을 수 없습니다."),
    PEN_NOT_FOUND(HttpStatus.NOT_FOUND, "방 정보를 찾을 수 없습니다."),
    SALES_NOT_FOUND(HttpStatus.NOT_FOUND, "판매 정보를 찾을 수 없습니다."),

    // 409 CONFLICT
    DUPLICATE_EARTAG(HttpStatus.CONFLICT, "이미 등록된 귀표번호입니다."),
    PEN_CAPACITY_EXCEEDED(HttpStatus.CONFLICT, "해당 칸의 수용 가능 두수가 초과되었습니다."),
    ALREADY_SOLD_LIVESTOCK(HttpStatus.CONFLICT, "이미 판매 완료된 가축입니다.");

    private final HttpStatus status;
    private final String message;
}