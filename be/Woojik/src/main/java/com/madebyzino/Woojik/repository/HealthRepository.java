package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Health;
import com.madebyzino.Woojik.entity.Livestock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthRepository extends JpaRepository<Health, Long> {
    List<Health> findByLivestock(Livestock livestock);
}