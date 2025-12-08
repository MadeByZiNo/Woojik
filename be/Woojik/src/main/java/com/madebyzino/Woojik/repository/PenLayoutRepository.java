package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Barn;
import com.madebyzino.Woojik.entity.PenLayout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PenLayoutRepository extends JpaRepository<PenLayout, Long> {
    List<PenLayout> findByBarnId(Long barnId);
}