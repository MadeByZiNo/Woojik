package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.breeding.BreedingAiRequest;
import com.madebyzino.Woojik.dto.breeding.CalvingRequest;
import com.madebyzino.Woojik.dto.breeding.EstrusRequest;
import com.madebyzino.Woojik.dto.breeding.PregnancyCheckRequest;
import com.madebyzino.Woojik.service.BreedingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/livestocks")
@RequiredArgsConstructor
public class BreedingController {

    private final BreedingService breedingService;

    // 발정 등록
    @PostMapping("/{id}/estrus")
    public ResponseEntity<Void> registerEstrus(
            @PathVariable Long id,
            @RequestBody EstrusRequest request
    ) {
        breedingService.registerEstrus(id, request);
        return ResponseEntity.ok().build();
    }

    // 인공수정 등록
    @PostMapping("/{id}/ai")
    public ResponseEntity<Long> registerAi(
            @PathVariable Long id,
            @RequestBody BreedingAiRequest request
    ) {
        return ResponseEntity.ok(breedingService.registerAi(id, request));
    }

    // 임신 등록
    @PostMapping("/{id}/pregnancy-checks")
    public ResponseEntity<Void> registerPregnancyCheck(
            @PathVariable Long id,
            @RequestBody PregnancyCheckRequest request
    ) {
        breedingService.registerPregnancyCheck(id, request);
        return ResponseEntity.ok().build();
    }

    // 분만 등록
    @PostMapping("/{id}/births")
    public ResponseEntity<Void> registerBirth(
            @PathVariable Long id,
            @RequestBody CalvingRequest request
    ) {
        breedingService.registerCalving(id, request);
        return ResponseEntity.ok().build();
    }


}