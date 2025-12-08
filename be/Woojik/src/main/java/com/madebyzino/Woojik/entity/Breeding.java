package com.madebyzino.Woojik.entity;

import com.madebyzino.Woojik.entity.enums.BreedingType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Breeding extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livestock_id")
    private Livestock livestock;

    @Enumerated(EnumType.STRING)
    private BreedingType type; // ESTRUS, AI, PREG_CHECK, CALVING

    private LocalDate eventDate; // 발생일

    private String sireCode; // KPN (인공수정 시)
    private Boolean isPregnant; // 임신감정 결과

    private LocalDate expectedDate; // 분만 예정일 (자동계산값 저장용)

    @Column(columnDefinition = "TEXT")
    private String notes; // 특이사항


    @Builder
    public Breeding(Livestock livestock, BreedingType type, LocalDate eventDate, String sireCode, Boolean isPregnant, LocalDate expectedDate,String notes) {
        this.livestock = livestock;
        this.type = type;
        this.eventDate = eventDate;
        this.sireCode = sireCode;
        this.isPregnant = isPregnant;
        this.expectedDate = expectedDate;
        this.notes = notes;
    }
}