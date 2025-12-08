package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.Sale;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    Optional<Sale> findByLivestock(Livestock livestock);

    @Query("SELECT s FROM Sale s JOIN FETCH s.livestock l WHERE l.status = :status")
    List<Sale> findByLivestockStatusWithFetchJoin(LivestockStatus status);
}