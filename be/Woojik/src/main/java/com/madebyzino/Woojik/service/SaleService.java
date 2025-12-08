package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.sale.SaleRequest;
import com.madebyzino.Woojik.dto.sale.SaleResponse;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.Sale;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import com.madebyzino.Woojik.error.CustomException;
import com.madebyzino.Woojik.error.ErrorCode;
import com.madebyzino.Woojik.repository.LivestockRepository;
import com.madebyzino.Woojik.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SaleService {

    private final SaleRepository saleRepository;
    private final LivestockRepository livestockRepository;

    // 판매 등록
    @Transactional
    public Long registerSale(Long livestockId, SaleRequest request) {
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        // 1. 이미 팔린 소인지 확인
        if (livestock.getStatus() == LivestockStatus.SOLD) {
            throw new CustomException(ErrorCode.ALREADY_SOLD_LIVESTOCK);
        }

        // 2.  휴약기간 및 질병 상태 확인
        if (!livestock.isSafeToSell(request.getSaleDate())) {
            throw new CustomException(ErrorCode.LIVESTOCK_NOT_SAFE_TO_SELL);
        }

        // 3. Sale 엔티티 생성 및 저장
        Sale sale = Sale.builder()
                .livestock(livestock)
                .saleDate(request.getSaleDate())
                .price(request.getPrice())
                .customerName(request.getCustomerName())
                .weight(request.getWeight())
                .grade(request.getGrade())
                .notes(request.getNotes())
                .build();

        saleRepository.save(sale);

        // 4. 소 상태 변경
        livestock.changeStatus(LivestockStatus.SOLD);

        return sale.getId();
    }

    // 2. 판매 정보 조회 (getSaleInfo) - DTO 업데이트 반영
    public SaleResponse getSaleInfo(Long livestockId) {
        Livestock livestock = livestockRepository.findById(livestockId)
                .orElseThrow(() -> new CustomException(ErrorCode.LIVESTOCK_NOT_FOUND));

        Sale sale = saleRepository.findByLivestock(livestock)
                .orElseThrow(() -> new CustomException(ErrorCode.SALES_NOT_FOUND));

        return new SaleResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getSoldLivestockList() {

        List<Sale> soldSales = saleRepository.findByLivestockStatusWithFetchJoin(LivestockStatus.SOLD);

        // DTO 변환 시, Livestock 엔티티는 이미 로드되어 있으므로 지연 로딩 쿼리 발생 안함
        return soldSales.stream()
                .map(SaleResponse::new)
                .collect(Collectors.toList());
    }

}