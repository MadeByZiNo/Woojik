package com.madebyzino.Woojik.dto.livestock;

import com.madebyzino.Woojik.entity.Livestock;
import lombok.Data;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
public class LivestockResponse {
    private Long id;
    private String earTag;      // 이력번호
    private String name;        // 이름(별칭)
    private String gender;      // 성별
    private String status;      // 상태
    private String location;    // 축사 위치
    private LocalDate birthDate; // 생년월일
    private Integer months;     // 월령

    public LivestockResponse(Livestock entity) {
        this.id = entity.getId();
        this.earTag = entity.getEarTag();
        this.name = entity.getName();

        this.status = entity.getStatus() != null ? entity.getStatus().name() : null;
        this.gender = entity.getGender() != null ? entity.getGender().name() : null;

        this.birthDate = entity.getBirthDate();

        if (entity.getPen() != null) {
            this.location = String.format("%s %s",
                    entity.getPen().getBarn().getName(),
                    entity.getPen().getName());
        } else {
            this.location = "미지정";
        }

        if (entity.getBirthDate() != null) {
            this.months = (int) ChronoUnit.MONTHS.between(entity.getBirthDate(), LocalDate.now());
        }
    }
}