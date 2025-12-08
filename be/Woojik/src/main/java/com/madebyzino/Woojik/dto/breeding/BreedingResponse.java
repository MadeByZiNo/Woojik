package com.madebyzino.Woojik.dto.breeding;

import com.madebyzino.Woojik.entity.Breeding;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BreedingResponse {
    private Long id;
    private String type;
    private LocalDate eventDate;
    private String sireCode;
    private Boolean isPregnant;
    private LocalDate expectedDate;
    private String notes;

    public BreedingResponse(Breeding entity) {
        this.id = entity.getId();
        this.type = entity.getType() != null ? entity.getType().name() : null;
        this.eventDate = entity.getEventDate();
        this.sireCode = entity.getSireCode();
        this.isPregnant = entity.getIsPregnant();
        this.expectedDate = entity.getExpectedDate();
        this.notes = entity.getNotes();
    }
}