package com.madebyzino.Woojik.repository;

import com.madebyzino.Woojik.entity.Barn;
import com.madebyzino.Woojik.entity.Livestock;
import com.madebyzino.Woojik.entity.Sale;
import com.madebyzino.Woojik.entity.enums.LivestockStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface LivestockRepository extends JpaRepository<Livestock, Long> {
    // 귀표번호 중복 검사
    boolean existsByEarTag(String earTag);

    // 검색: 귀표번호 뒷자리로 찾기
    List<Livestock> findByEarTagEndingWith(String earTagBackNumber);

    @Query("SELECT s FROM Sale s JOIN FETCH s.livestock l WHERE l.status = :status")
    List<Sale> findByLivestockStatusWithFetchJoin(LivestockStatus status);
    // 특정 방의 소 마리 수 조회
    long countByPenId(Long penId);

    // 특정 방에 있는 소들 조회
    @Query("SELECT l FROM Livestock l WHERE l.pen.id = :penId")
    List<Livestock> findByPenId(@Param("penId") Long penId);

    @Query("SELECT DISTINCT l.pen.id FROM Livestock l WHERE l.pen.id IN :penIds")
    Set<Long> findPenIdsWithLivestockIn(@Param("penIds") Collection<Long> penIds);

    List<Livestock> findByStatusNot(LivestockStatus status);
}