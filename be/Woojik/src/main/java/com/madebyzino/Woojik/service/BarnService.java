package com.madebyzino.Woojik.service;

import com.madebyzino.Woojik.dto.barn.BarnResponse;
import com.madebyzino.Woojik.dto.pen.PenResponse;
import com.madebyzino.Woojik.entity.Barn;
import com.madebyzino.Woojik.entity.Pen;
import com.madebyzino.Woojik.error.CustomException;
import com.madebyzino.Woojik.error.ErrorCode;
import com.madebyzino.Woojik.repository.BarnRepository;
import com.madebyzino.Woojik.repository.PenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BarnService {

    private final BarnRepository barnRepository;
    private final PenRepository penRepository;

    // 전체 축사 목록 조회

    public List<BarnResponse> getAllBarns() {
        return barnRepository.findAll().stream()
                .map(BarnResponse::new)
                .collect(Collectors.toList());
    }

     // 특정 축사 ID에 소속된 방 목록 조회
    public List<PenResponse> getPensByBarn(Long barnId) {
        Barn barn = barnRepository.findById(barnId)
                .orElseThrow(() -> new CustomException(ErrorCode.BARN_NOT_FOUND));

        List<Pen> pens = penRepository.findByBarn(barn);

        return pens.stream()
                .map(PenResponse::new)
                .collect(Collectors.toList());
    }
}