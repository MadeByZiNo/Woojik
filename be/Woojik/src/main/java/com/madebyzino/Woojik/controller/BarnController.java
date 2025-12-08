package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.barn.BarnResponse;
import com.madebyzino.Woojik.dto.pen.PenResponse;
import com.madebyzino.Woojik.service.BarnService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/barns")
@RequiredArgsConstructor
public class BarnController {

    private final BarnService barnService;

    // GET /api/barns : 전체 축사 목록 조회
    @GetMapping
    public ResponseEntity<List<BarnResponse>> getAllBarns() {
        return ResponseEntity.ok(barnService.getAllBarns());
    }

    // GET /api/barns/{barnId}/pens : 특정 축사의 방 목록 조회
    @GetMapping("/{barnId}/pens")
    public ResponseEntity<List<PenResponse>> getPensByBarn(@PathVariable Long barnId) {
        return ResponseEntity.ok(barnService.getPensByBarn(barnId));
    }
}