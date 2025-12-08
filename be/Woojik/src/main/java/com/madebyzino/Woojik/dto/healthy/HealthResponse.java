package com.madebyzino.Woojik.dto.healthy;

import com.madebyzino.Woojik.entity.Health;
import lombok.Data;
import java.time.LocalDate;

@Data
public class HealthResponse {
    private Long id;
    private String type;
    private LocalDate eventDate;
    private String diseaseName;
    private String medicine;
    private String description;
    private Integer withdrawalPeriod;

    public HealthResponse(Health entity) {
        this.id = entity.getId();
        this.type = entity.getType() != null ? entity.getType().name() : null;
        this.eventDate = entity.getEventDate();
        this.diseaseName = entity.getDiseaseName();
        this.medicine = entity.getMedicine();
        this.description = entity.getDescription();
        this.withdrawalPeriod = entity.getWithdrawalPeriod();
    }
}