package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Barn;
import com.madebyzino.Woojik.entity.Pen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PenRepository extends JpaRepository<Pen, Long> {
    Optional<Pen> findByName(String name);
    List<Pen> findByBarn(Barn barn);
    List<Pen> findByBarnId(Long barnId);
}