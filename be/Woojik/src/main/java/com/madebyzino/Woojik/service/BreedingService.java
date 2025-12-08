package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.breeding.BreedingAiRequest;
import com.madebyzino.Woojik.dto.breeding.CalvingRequest;
import com.madebyzino.Woojik.dto.breeding.EstrusRequest;
import com.madebyzino.Woojik.dto.breeding.PregnancyCheckRequest;
import com.madebyzino.Woojik.entity.Breeding;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.enums.BreedingType;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.error.CustomException;
import com.madebyzino.Woojik.error.ErrorCode;
import com.madebyzino.Woojik.repository.BreedingRepository;
import com.madebyzino.Woojik.repository.LivestockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BreedingService {

    private final BreedingRepository breedingRepository;
    private final LivestockRepository livestockRepository;

    @Transactional
    public void registerEstrus(Long livestockId, EstrusRequest request) {
        Livestock cow = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        Breeding estrus = Breeding.builder()
                .livestock(cow)
                .type(BreedingType.ESTRUS)
                .eventDate(request.getDate())
                .notes(request.getNotes())
                .build();

        breedingRepository.save(estrus);

        cow.setLastEstrusDate(request.getDate());
    }

    //  (날짜 자동 계산)
    /**
     *         인공수정 등록
     *         // 날짜 계산 로직
     *         // 분만 예정일 = 수정일 + 285일
     */
    @Transactional
    public Long registerAi(Long livestockId, BreedingAiRequest request) {
        Livestock cow = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        Breeding breeding = Breeding.builder()
                .livestock(cow)
                .type(BreedingType.AI)
                .eventDate(request.getDate())
                .sireCode(request.getSireCode())
                .expectedDate(request.getDate().plusDays(285))
                .notes(request.getNotes())
                .build();

        cow.setLastAiDate(request.getDate());

        return breedingRepository.save(breeding).getId();
    }

    @Transactional
    public void registerPregnancyCheck(Long livestockId, PregnancyCheckRequest request) {
        // 1. 소 조회
        Livestock cow = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 2. 이력 기록 저장
        Breeding pregCheck = Breeding.builder()
                .livestock(cow)
                .type(BreedingType.PREG_CHECK)
                .eventDate(request.getDate())
                .isPregnant(request.isPregnant())
                .notes(request.getNotes())
                .build();

        breedingRepository.save(pregCheck);

        if (request.isPregnant()) {
            cow.changeStatus(LivestockStatus.PREGNANT);

            if (cow.getLastAiDate() != null) {
                cow.setExpectedDate(cow.getLastAiDate().plusDays(285));
            }
        } else {
            cow.changeStatus(LivestockStatus.FATTENING);
            // [추가] 임신 꽝이면 예정일 삭제
            cow.setExpectedDate(null);
        }
    }

    // 분만 처리
    @Transactional
    public void registerCalving(Long livestockId, CalvingRequest request) {
        // 1. 엄마 소 조회
        Livestock mother = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 2. 아빠 정보 추적 (엄마의 마지막 AI 기록에서 KPN 가져오기)
        // 실제 아빠 개체(Livestock)가 있는 게 아니라 '정액번호(String)'로 관리
        String fatherKpn = breedingRepository.findTopByLivestockAndTypeOrderByEventDateDesc(mother, BreedingType.AI)
                .map(Breeding::getSireCode)
                .orElse("Unknown"); // 기록 없으면 미상

        // 3. 송아지 생성 (엄마 스펙 상속)
        Livestock calf = Livestock.builder()
                .earTag(request.getCalfEarTag() != null ? request.getCalfEarTag() : "TEMP-" + System.currentTimeMillis()) // 귀표 없으면 임시번호
                .name(request.getCalfName())
                .birthDate(request.getDate())
                .gender(request.getCalfGender())
                .breed(mother.getBreed())
                .status(LivestockStatus.CALF)
                .pen(mother.getPen())
                .mother(mother)
                .notes("부(父): " + fatherKpn)
                .build();

        livestockRepository.save(calf);

        // 4. 엄마 소 상태 변경 (출산했으니 다시 비육/포유 상태로)
        mother.changeStatus(LivestockStatus.FATTENING);
        mother.setExpectedDate(null);

        int currentCount = mother.getBreedingCount() == null ? 0 : mother.getBreedingCount();
        mother.setBreedingCount(currentCount + 1);

        // 5. 분만 이력 저장
        Breeding calvingLog = Breeding.builder()
                .livestock(mother)
                .type(BreedingType.CALVING)
                .eventDate(request.getDate())
                .build();

        breedingRepository.save(calvingLog);
    }

}