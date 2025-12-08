package com.madebyzino.Woojik.dto.barn;

import com.madebyzino.Woojik.entity.Barn;
import lombok.Data;

@Data
public class BarnResponse {
    private Long id;
    private String name;

    public BarnResponse(Barn barn) {
        this.id = barn.getId();
        this.name = barn.getName();
    }
}