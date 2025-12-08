package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.healthy.HealthRequest;
import com.madebyzino.Woojik.entity.Health;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.enums.HealthType;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.error.CustomException;
import com.madebyzino.Woojik.error.ErrorCode;
import com.madebyzino.Woojik.repository.HealthRepository;
import com.madebyzino.Woojik.repository.LivestockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional
public class HealthService {

    private final HealthRepository healthRepository;
    private final LivestockRepository livestockRepository;

    // 건강 기록 등록 (백신/치료)
    public void registerHealth(Long livestockId, HealthRequest request) {
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 1. 기록 저장
        Health health = Health.builder()
                .livestock(livestock)
                .type(request.getType())
                .eventDate(request.getDate())
                .diseaseName(request.getDiseaseName())
                .medicine(request.getMedicine())
                .description(request.getDescription())
                .withdrawalPeriod(request.getWithdrawalPeriod())
                .build();
        healthRepository.save(health);

        // 최근 병명 및 치료일 업데이트
        livestock.updateHealthInfo(request.getDiseaseName(), request.getDate());

        // 3. 휴약기간적용
        if (request.getWithdrawalPeriod() != null && request.getWithdrawalPeriod() > 0) {
            LocalDate newWithdrawalDate = request.getDate().plusDays(request.getWithdrawalPeriod());

            if (livestock.getWithdrawalDate() == null || newWithdrawalDate.isAfter(livestock.getWithdrawalDate())) {
                livestock.setWithdrawalDate(newWithdrawalDate);
            }
        }

        // 4. 상태 변경 로직
        if (request.getType() == HealthType.TREAT) {
            if (livestock.getStatus() != LivestockStatus.PREGNANT) {
                livestock.changeStatus(LivestockStatus.SICK);
            }
        }
    }

    public void recover(Long livestockId) {
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        if (livestock.getStatus() == LivestockStatus.SICK) {
            livestock.changeStatus(LivestockStatus.FATTENING);
        }
    }
}