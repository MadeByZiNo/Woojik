package com.madebyzino.Woojik.dto.livestock;

import com.madebyzino.Woojik.dto.breeding.BreedingResponse;
import com.madebyzino.Woojik.dto.healthy.HealthResponse;
import com.madebyzino.Woojik.entity.Livestock;
import lombok.Data;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Data

public class LivestockDetailResponse {
    private Long id;
    private String earTag;
    private String name;
    private String breed;
    private String status;
    private String gender;
    private String location;
    private LocalDate birthDate;
    private Integer months;
    private String notes;

    private Long motherId;
    private String motherEarTag;
    private Long fatherId;
    private String fatherEarTag;

    private LocalDate withdrawalDate;       // 휴약기간 만료일
    private String lastTreatment;           // 최근 치료/백신 내역
    private LocalDate lastTreatmentDate;    // 최근 치료일
    private LocalDate lastEstrusDate;       // 마지막 발정일
    private LocalDate lastAiDate;           // 마지막 수정일
    private LocalDate expectedDate;         // 분만 예정일
    private Integer breedingCount;          // 산차 (출산 횟수)

    private List<HealthResponse> healthHistory;
    private List<BreedingResponse> breedingHistory;

    private Long penId;
    private Long barnId;

    public LivestockDetailResponse(
            Livestock entity,
            List<HealthResponse> healthHistory,
            List<BreedingResponse> breedingHistory)
    {
        this.id = entity.getId();
        this.earTag = entity.getEarTag();
        this.name = entity.getName();
        this.breed = entity.getBreed();

        // Enum 변환
        this.status = entity.getStatus() != null ? entity.getStatus().name() : null;
        this.gender = entity.getGender() != null ? entity.getGender().name() : null;

        // 위치 정보 포맷팅
        if (entity.getPen() != null) {
            this.location = String.format("%s %s", entity.getPen().getBarn().getName(), entity.getPen().getName());
        } else {
            this.location = "미지정";
        }

        // 날짜 및 월령 계산
        this.birthDate = entity.getBirthDate();
        if (entity.getBirthDate() != null) {
            this.months = (int) ChronoUnit.MONTHS.between(entity.getBirthDate(), LocalDate.now());
        }

        this.notes = entity.getNotes();

        // 족보
        if (entity.getMother() != null) {
            this.motherId = entity.getMother().getId();
            this.motherEarTag = entity.getMother().getEarTag();
        }
        if (entity.getFather() != null) {
            this.fatherId = entity.getFather().getId();
            this.fatherEarTag = entity.getFather().getEarTag();
        }

        // 건강/번식 요약 필드
        this.withdrawalDate = entity.getWithdrawalDate();
        this.lastTreatment = entity.getLastDiseaseName();
        this.lastTreatmentDate = entity.getLastTreatmentDate();
        this.lastEstrusDate = entity.getLastEstrusDate();
        this.lastAiDate = entity.getLastAiDate();
        this.expectedDate = entity.getExpectedDate();
        this.breedingCount = entity.getBreedingCount();

        // 이력 리스트
        this.healthHistory = healthHistory;
        this.breedingHistory = breedingHistory;

        this.penId = entity.getPen().getId();
        this.barnId = entity.getPen().getBarn().getId();
    }
}