package com.madebyzino.Woojik.controller;

import com.madebyzino.Woojik.dto.sale.SaleRequest;
import com.madebyzino.Woojik.dto.sale.SaleResponse;
import com.madebyzino.Woojik.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    @PostMapping("/{livestockId}")
    public ResponseEntity<Long> registerSale(
            @PathVariable("livestockId") Long livestockId,
            @RequestBody SaleRequest request
    ) {
        Long saleId = saleService.registerSale(livestockId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saleId);
    }

    @GetMapping("/{livestockId}")
    public ResponseEntity<SaleResponse> getSaleInfo(@PathVariable("livestockId") Long livestockId) {
        SaleResponse response = saleService.getSaleInfo(livestockId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sold-list")
    public ResponseEntity<List<SaleResponse>> getSoldLivestockList() {
        List<SaleResponse> response = saleService.getSoldLivestockList();
        return ResponseEntity.ok(response);
    }

}