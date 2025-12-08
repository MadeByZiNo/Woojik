package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Breeding;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.enums.BreedingType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BreedingRepository extends JpaRepository<Breeding, Long> {

    List<Breeding> findByLivestock(Livestock livestock);

    // 특정 소의 가장 최근 인공수정 기록 찾기 (아빠 찾기용)
    Optional<Breeding> findTopByLivestockAndTypeOrderByEventDateDesc(Livestock livestock, BreedingType type);
}