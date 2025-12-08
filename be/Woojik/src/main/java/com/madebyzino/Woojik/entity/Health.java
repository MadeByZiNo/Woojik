package com.madebyzino.Woojik.entity;

import com.madebyzino.Woojik.entity.enums.HealthType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Health extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livestock_id")
    private Livestock livestock;

    @Enumerated(EnumType.STRING)
    private HealthType type; // VACCINE, TREAT

    private LocalDate eventDate;
    private String diseaseName; // 병명/목적
    private String medicine;    // 약품명

    @Column(columnDefinition = "TEXT")
    private String description; // 처치 내용

    private Integer withdrawalPeriod; // 휴약기간(일)

    @Builder
    public Health(Livestock livestock, HealthType type, LocalDate eventDate, String diseaseName, String medicine, String description, Integer withdrawalPeriod) {
        this.livestock = livestock;
        this.type = type;
        this.eventDate = eventDate;
        this.diseaseName = diseaseName;
        this.medicine = medicine;
        this.description = description;
        this.withdrawalPeriod = withdrawalPeriod;
    }
}