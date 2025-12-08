package com.madebyzino.Woojik.dto.pen;

import com.madebyzino.Woojik.entity.Pen;
import lombok.Data;

@Data
public class PenResponse {
    private Long id;
    private String name;

    public PenResponse(Pen pen) {
        this.id = pen.getId();
        this.name = pen.getName();
    }
}