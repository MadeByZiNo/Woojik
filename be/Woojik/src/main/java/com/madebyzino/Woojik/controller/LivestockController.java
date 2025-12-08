package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.livestock.*;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.service.LivestockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livestocks")
@RequiredArgsConstructor
public class LivestockController {

    private final LivestockService livestockService;

    // 등록
    @PostMapping
    public ResponseEntity<Long> register(@RequestBody LivestockRequest request) {
        return ResponseEntity.ok(livestockService.register(request));
    }

    // 판매제외 조회
    @GetMapping
    public ResponseEntity<List<LivestockResponse>> getManageableLivestockList() {
        return ResponseEntity.ok(livestockService.getManageableLivestockList());
    }

    // 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<LivestockDetailResponse> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(livestockService.getDetail(id));
    }

    // 이동
    @PatchMapping("/{id}/move")
    public ResponseEntity<Void> movePen(@PathVariable Long id, @RequestBody Long newPenId) {
        livestockService.movePen(id, newPenId);
        return ResponseEntity.ok().build();
    }

    // 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody LivestockUpdateRequest request
    ) {
        livestockService.update(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-pen/{penId}")
    public ResponseEntity<List<LivestockResponse>> getListByPen(@PathVariable("penId") Long penId) {
        List<LivestockResponse> list = livestockService.getListByPen(penId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{livestockId}/move")
    public ResponseEntity<Void> moveLivestock(
            @PathVariable("livestockId") Long livestockId,
            @RequestBody LivestockMoveRequest request
    ) {
        livestockService.moveLivestock(livestockId, request.getDestinationPenId());
        return ResponseEntity.ok().build();
    }
}