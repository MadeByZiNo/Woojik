package com.madebyzino.Woojik.entity;

import com.madebyzino.Woojik.entity.enums.Gender;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "livestocks", indexes = @Index(name = "idx_eartag", columnList = "earTag"))
public class Livestock extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String earTag; // 귀표번호

    private String name;   // 별명
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private Gender gender; // MALE, FEMALE, CASTRATED

    @Enumerated(EnumType.STRING)
    private LivestockStatus status; // CALF, FATTENING, PREGNANT, SICK, SOLD

    private String breed; // 품종

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pen_id")
    private Pen pen; // 현재 위치

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id")
    private Livestock mother; // 모

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id")
    private Livestock father; // 부

    @Column(columnDefinition = "TEXT")
    private String notes; // 특이사항

    @Setter
    private Integer breedingCount; // 현재 산차
    @Setter
    private LocalDate lastEstrusDate; // 마지막 발정일
    @Setter
    private LocalDate lastAiDate;     // 마지막 수정일 (AI 날짜)
    @Setter
    private LocalDate expectedDate;   // 분만 예정일

    // 휴약기간 만료일
    @Setter
    private LocalDate withdrawalDate;

    //  최근 백신/치료 내역 요약
    private String lastDiseaseName; // 최근 앓은 병명
    private LocalDate lastTreatmentDate; // 최근 치료일


    @Builder
    public Livestock(String earTag, String name, LocalDate birthDate, Gender gender, LivestockStatus status, String breed, Pen pen, Livestock mother, Livestock father, String notes) {
        this.earTag = earTag;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.status = status;
        this.breed = breed;
        this.pen = pen;
        this.mother = mother;
        this.father = father;
        this.notes = notes;
    }

    public void changePen(Pen pen) {
        this.pen = pen;
    }

    public void changeStatus(LivestockStatus status) {
        this.status = status;
    }

    public void updateInfo(String name, Gender gender, LocalDate birthDate, String breed, String notes) {
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.breed = breed;
        this.notes = notes;
    }

    public void updateHealthInfo(String diseaseName, LocalDate treatDate) {
        this.lastDiseaseName = diseaseName;
        this.lastTreatmentDate = treatDate;
    }


    public boolean isSafeToSell(LocalDate today) {
        if (this.status == LivestockStatus.SOLD) return false;
        if (this.status == LivestockStatus.SICK) return false;
        if (withdrawalDate != null && today.isBefore(withdrawalDate)) return false;
        return true;
    }

    public void movePen(Pen pen) {
        this.pen = pen;
    }
}