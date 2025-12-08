package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.layout.BarnLayoutResponse;
import com.madebyzino.Woojik.dto.layout.LayoutSaveRequest;
import com.madebyzino.Woojik.dto.layout.PenLayoutDto;
import com.madebyzino.Woojik.entity.Barn;
import com.madebyzino.Woojik.entity.Pen;
import com.madebyzino.Woojik.entity.PenLayout;
import com.madebyzino.Woojik.repository.BarnRepository;
import com.madebyzino.Woojik.repository.LivestockRepository;
import com.madebyzino.Woojik.repository.PenLayoutRepository;
import com.madebyzino.Woojik.repository.PenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MapLayoutService {

    private final BarnRepository barnRepository;
    private final PenRepository penRepository;
    private final PenLayoutRepository penLayoutRepository;
    private final LivestockRepository livestockRepository;
    // 특정 축사의 현재 배치 상태와 미배치 방 목록을 조회합니다.

    // MapLayoutService.java
    @Transactional(readOnly = true)
    public BarnLayoutResponse getLayoutData(Long barnId) {
        // 1. Barn 정보 확인
        Barn barn = barnRepository.findById(barnId)
                .orElseThrow(() -> new IllegalArgumentException("축사 ID를 찾을 수 없습니다: " + barnId));

        // 2. 해당 축사의 모든 Pen (배치 여부 상관없이) 조회
        // 가정: Pen Entity에 barnId 필드가 있거나, Barn과 양방향 관계가 있다고 가정
        List<Pen> allPens = penRepository.findByBarnId(barnId);

        // 3. 현재 배치된 PenLayout 조회
        List<PenLayout> layouts = penLayoutRepository.findByBarnId(barnId);

        // 4. 배치된 Pen ID Set 생성
        Set<Long> placedPenIds = layouts.stream()
                .map(layout -> layout.getPen().getId())
                .collect(Collectors.toSet());

        // 5. 배치 데이터 DTO 변환
        List<PenLayoutDto> placedLayouts = layouts.stream()
                .map(layout -> PenLayoutDto.builder()
                        .penId(layout.getPen().getId())
                        .penName(layout.getPen().getName())
                        .capacity(layout.getPen().getCapacity())
                        .gridRow(layout.getGridRow())
                        .gridCol(layout.getGridCol())
                        .rowSpan(layout.getRowSpan())
                        .colSpan(layout.getColSpan())
                        .build())
                .collect(Collectors.toList());

        // 6. 미배치 데이터 DTO 변환
        List<PenLayoutDto> unplacedLayouts = allPens.stream()
                .filter(pen -> !placedPenIds.contains(pen.getId()))
                .map(pen -> PenLayoutDto.builder()
                        .penId(pen.getId())
                        .penName(pen.getName())
                        .capacity(pen.getCapacity())
                        .gridRow(0).gridCol(0).rowSpan(1).colSpan(1)
                        .build())
                .collect(Collectors.toList());

        Map<Long, Integer> livestockCounts = new HashMap<>();
        for (Pen pen : allPens) {
            Integer count = (int) livestockRepository.countByPenId(pen.getId());
            livestockCounts.put(pen.getId(), count);
        }

        return BarnLayoutResponse.builder()
                .barnId(barnId)
                .barnName(barn.getName())
                .layouts(placedLayouts)
                .unplacedPens(unplacedLayouts)
                .livestockCounts(livestockCounts)
                .build();
    }

    /**
     * 축사 배치 정보를 저장/업데이트합니다. (강제 덮어쓰기/삭제 로직 포함)
     */
    // MapLayoutService.java (saveLayoutData 메서드)

    @Transactional
    public void saveLayoutData(Long barnId, LayoutSaveRequest request) {

        // 1. Barn 정보 확인
        Barn barn = barnRepository.findById(barnId)
                .orElseThrow(() -> new IllegalArgumentException("축사 ID를 찾을 수 없습니다: " + barnId));

        // 2. 현재 DB에 저장된 PenLayout 목록 조회 (삭제/업데이트 비교용)
        List<PenLayout> existingLayouts = penLayoutRepository.findByBarnId(barnId);
        Map<Long, PenLayout> existingLayoutMap = existingLayouts.stream()
                .collect(Collectors.toMap(
                        layout -> layout.getPen().getId(),
                        layout -> layout)
                );

        // 3. 요청된 Pen ID Set (저장 대상)
        Set<Long> requestedPenIds = request.getLayouts().stream()
                // 🚨 음수 ID는 저장/업데이트 대상이 아니므로 필터링해야 함 (새로운 Pen 생성 로직으로 처리됨)
                .filter(data -> data.getPenId() > 0)
                .map(PenLayoutDto::getPenId)
                .collect(Collectors.toSet());

        // 4. 🚨 삭제 대상 처리: DB에는 있지만, 요청 목록 (양수 ID만)에 없는 기존 배치
        List<PenLayout> deletedLayouts = existingLayouts.stream()
                .filter(layout -> !requestedPenIds.contains(layout.getPen().getId()))
                .collect(Collectors.toList());

        // 4-1. 가축 포함 방 삭제 방지 유효성 검사 (이전 단계에서 추가된 로직)
        if (!deletedLayouts.isEmpty()) {
            Set<Long> penIdsToDelete = deletedLayouts.stream()
                    .map(layout -> layout.getPen().getId()).collect(Collectors.toSet());
            Set<Long> pensWithLivestock = livestockRepository.findPenIdsWithLivestockIn(penIdsToDelete);

            if (!pensWithLivestock.isEmpty()) {
                String penNames = deletedLayouts.stream()
                        .filter(layout -> pensWithLivestock.contains(layout.getPen().getId()))
                        .map(layout -> layout.getPen().getName())
                        .collect(Collectors.joining(", "));
                throw new IllegalArgumentException(
                        "배치 정보 변경 실패: 가축이 남아있는 방(" + penNames + ")은 미배치(삭제)할 수 없습니다."
                );
            }
        }

        // 4-2. 삭제 실행
        penLayoutRepository.deleteAll(deletedLayouts);

        // 5. 🚨 저장/업데이트 처리 (생성, 업데이트 로직 분리)
        for (PenLayoutDto data : request.getLayouts()) {

            if (data.getPenId() < 0) {
                // 신규 Pen 생성 로직 (ID가 음수인 경우)
                if (penRepository.findByName(data.getPenName()).isPresent()) {
                    throw new IllegalArgumentException("방 이름 '" + data.getPenName() + "'은 이미 존재합니다.");
                }

                // 1. Pen 엔티티 생성 및 저장 (DB ID 할당)
                Pen newPen = Pen.builder()
                        .barn(barn)
                        .name(data.getPenName())
                        .capacity(data.getCapacity())
                        .build();
                newPen = penRepository.save(newPen);

                // 2. PenLayout 엔티티 생성 (새로운 배치 정보)
                PenLayout layout = PenLayout.builder()
                        .barn(barn)
                        .pen(newPen) // 새로 생성된 Pen 사용
                        .gridRow(data.getGridRow())
                        .gridCol(data.getGridCol())
                        .rowSpan(data.getRowSpan())
                        .colSpan(data.getColSpan())
                        .build();
                penLayoutRepository.save(layout);

            } else {
                //  기존 Pen 업데이트 로직 (ID가 양수인 경우)

                Pen pen = penRepository.findById(data.getPenId())
                        .orElseThrow(() -> new IllegalArgumentException("방 ID를 찾을 수 없습니다: " + data.getPenId()));

                PenLayout layout;

                // 기존에 존재하는 배치 정보 -> 업데이트
                if (existingLayoutMap.containsKey(data.getPenId())) {
                    layout = existingLayoutMap.get(data.getPenId());
                    layout.updateLayout(data.getGridRow(), data.getGridCol(), data.getRowSpan(), data.getColSpan());

                } else {
                    // DB에 Pen은 있으나, PenLayout은 없는 경우 (미배치였다가 배치됨) -> 새로 생성
                    layout = PenLayout.builder()
                            .barn(barn)
                            .pen(pen)
                            .gridRow(data.getGridRow())
                            .gridCol(data.getGridCol())
                            .rowSpan(data.getRowSpan())
                            .colSpan(data.getColSpan())
                            .build();
                }
                penLayoutRepository.save(layout);
            }
        }
    }
}
