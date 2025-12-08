package com.madebyzino.Woojik.dto.layout;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class BarnLayoutResponse {
    private Long barnId;
    private String barnName;
    private List<PenLayoutDto> layouts;
    private List<PenLayoutDto> unplacedPens;
    private Map<Long, Integer> livestockCounts;

    public BarnLayoutResponse(Long barnId, String barnName, List<PenLayoutDto> layouts, List<PenLayoutDto> unplacedPens, Map<Long, Integer> livestockCounts) {
        this.barnId = barnId;
        this.barnName = barnName;
        this.layouts = layouts;
        this.unplacedPens = unplacedPens;
        this.livestockCounts = livestockCounts;
    }
}