package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.breeding.BreedingResponse;
import com.madebyzino.Woojik.dto.healthy.HealthResponse;
import com.madebyzino.Woojik.dto.livestock.LivestockDetailResponse;
import com.madebyzino.Woojik.dto.livestock.LivestockRequest;
import com.madebyzino.Woojik.dto.livestock.LivestockResponse;
import com.madebyzino.Woojik.dto.livestock.LivestockUpdateRequest;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.Pen;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.error.CustomException;
import com.madebyzino.Woojik.error.ErrorCode;
import com.madebyzino.Woojik.repository.BreedingRepository;
import com.madebyzino.Woojik.repository.HealthRepository;
import com.madebyzino.Woojik.repository.LivestockRepository;
import com.madebyzino.Woojik.repository.PenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LivestockService {

    private final LivestockRepository livestockRepository;
    private final PenRepository penRepository;
    private final HealthRepository healthRepository;
    private final BreedingRepository breedingRepository;

    // 개체 등록
    @Transactional
    public Long register(LivestockRequest request) {
        // 중복 검사
        if (livestockRepository.existsByEarTag(request.getEarTag())) {
            throw new CustomException(ErrorCode.DUPLICATE_EARTAG);
        }

        // 축사 위치 조회
        Pen pen = null;
        if (request.getPenId() != null) {
            pen = penRepository.findById(request.getPenId())
                    .orElseThrow(() -> new CustomException(ErrorCode.PEN_NOT_FOUND));
        }

        // 엔티티 생성
        Livestock livestock = Livestock.builder()
                .earTag(request.getEarTag())
                .name(request.getName())
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .breed(request.getBreed())
                .status(LivestockStatus.CALF) // 기본값 송아지 (혹은 입력받아도 됨)
                .pen(pen)
                .build();

        return livestockRepository.save(livestock).getId();
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public List<LivestockResponse> getManageableLivestockList() {
        // SOLD 상태가 아닌 모든 가축을 조회
        List<Livestock> livestockList = livestockRepository.findByStatusNot(LivestockStatus.SOLD);

        // DTO 매핑
        return livestockList.stream()
                .map(LivestockResponse::new) // 기존 DTO 생성자 사용 가정
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LivestockDetailResponse getDetail(Long id) {
        Livestock livestock = livestockRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 1. 건강 이력 조회 및 DTO 변환 (findByLivestock 호출)
        List<HealthResponse> healthHistory = healthRepository.findByLivestock(livestock).stream()
                .map(HealthResponse::new)
                .collect(Collectors.toList());

        // 2. 번식 이력 조회 및 DTO 변환 (findByLivestock 호출)
        List<BreedingResponse> breedingHistory = breedingRepository.findByLivestock(livestock).stream()
                .map(BreedingResponse::new)
                .collect(Collectors.toList());

        // 3. 통합 DTO 반환
        return new LivestockDetailResponse(livestock, healthHistory, breedingHistory);
    }

    // 개체 이동 (방 옮기기)
    @Transactional
    public void movePen(Long livestockId, Long newPenId) {
        // 1. 소 조회
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 2. 이동할 방 조회
        Pen newPen = penRepository.findById(newPenId)
                .orElseThrow(() -> new CustomException(ErrorCode.PEN_NOT_FOUND)); // 에러코드 추가 필요

        if (newPen.equals(livestock.getPen())) {
            return;
        }

        // 현재 그 방에 있는 소 마릿수 조회
        long currentCount = livestockRepository.countByPenId(newPenId);
        if (currentCount >= newPen.getCapacity()) {
            throw new CustomException(ErrorCode.PEN_CAPACITY_EXCEEDED);
        }

        // 3. 이동 처리
        livestock.changePen(newPen);
    }

    // 소의 정보 업데이트
    @Transactional
    public void update(Long id, LivestockUpdateRequest request) {
        Livestock livestock = livestockRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        livestock.updateInfo(
                request.getName(),
                request.getGender(),
                request.getBirthDate(),
                request.getBreed(),
                request.getNotes()
        );
    }

    @Transactional(readOnly = true)
    public List<LivestockResponse> getListByPen(Long penId) {
        List<Livestock> livestockList = livestockRepository.findByPenId(penId);

        return livestockList.stream()
                .map(LivestockResponse::new)
                .collect(Collectors.toList());
    }


    @Transactional
    public void moveLivestock(Long livestockId, Long destinationPenId) {
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new IllegalArgumentException("가축 ID를 찾을 수 없습니다: " + livestockId));

        Pen destinationPen = penRepository.findById(destinationPenId)
                .orElseThrow(() -> new IllegalArgumentException("이동 대상 방(Pen)을 찾을 수 없습니다: " + destinationPenId));

        if (livestock.getPen() != null && livestock.getPen().getId().equals(destinationPenId)) {
            return;
        }

        livestock.movePen(destinationPen);
        livestockRepository.save(livestock);
    }
}