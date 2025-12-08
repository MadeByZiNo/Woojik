package com.madebyzino.Woojik.dto.layout;

import lombok.Data;

import java.util.List;

@Data
public class LayoutSaveRequest {
    private Long barnId;
    // 최종 배치된 방 목록. 이 목록에 없는 기존 배치는 삭제 처리됩니다.
    private List<PenLayoutDto> layouts;
}