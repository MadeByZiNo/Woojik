package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.layout.BarnLayoutResponse;
import com.madebyzino.Woojik.dto.layout.LayoutSaveRequest;
import com.madebyzino.Woojik.service.MapLayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/map/barns/{barnId}/layout")
public class MapLayoutController {

    private final MapLayoutService mapLayoutService;

    /**
     * GET /api/map/barns/{barnId}/layout
     * 특정 축사의 현재 배치 상태를 조회합니다.
     */
    @GetMapping
    public ResponseEntity<BarnLayoutResponse> getBarnLayout(@PathVariable("barnId") Long barnId) {
        BarnLayoutResponse response = mapLayoutService.getLayoutData(barnId);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/map/barns/{barnId}/layout
     * 축사 배치를 저장/업데이트합니다.
     */
    @PostMapping
    public ResponseEntity<Void> saveBarnLayout(
            @PathVariable("barnId") Long barnId,
            @RequestBody LayoutSaveRequest request
    ) {
        if (!barnId.equals(request.getBarnId())) {
            return ResponseEntity.badRequest().build();
        }

        mapLayoutService.saveLayoutData(barnId, request);

        return ResponseEntity.ok().build();
    }

}