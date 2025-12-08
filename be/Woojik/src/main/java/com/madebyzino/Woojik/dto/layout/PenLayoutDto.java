package com.madebyzino.Woojik.dto.layout;

import com.madebyzino.Woojik.entity.PenLayout;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PenLayoutDto {
    private Long penId;
    private String penName;
    private Integer capacity;
    private Integer gridRow;
    private Integer gridCol;
    private Integer rowSpan;
    private Integer colSpan;

}