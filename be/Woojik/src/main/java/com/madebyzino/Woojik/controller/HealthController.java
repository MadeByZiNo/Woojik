package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.healthy.HealthRequest;
import com.madebyzino.Woojik.service.HealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livestocks")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    // 1. 질병/백신 등록
    // POST /api/livestocks/{id}/healths
    @PostMapping("/{id}/healths")
    public ResponseEntity<Void> registerHealth(
            @PathVariable Long id,
            @RequestBody HealthRequest request
    ) {
        healthService.registerHealth(id, request);
        return ResponseEntity.ok().build();
    }

    // 2. 회복 처리 (완치)
    // PATCH /api/livestocks/{id}/recover
    @PatchMapping("/{id}/recover")
    public ResponseEntity<Void> recover(@PathVariable Long id) {
        healthService.recover(id);
        return ResponseEntity.ok().build();
    }
}