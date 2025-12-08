package com.madebyzino.Woojik.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "pen_layouts")
public class PenLayout extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 축사 ID (전체 축사 지도를 조회하는 기준)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barn_id", nullable = false)
    private Barn barn;

    // 방 ID (배치 정보를 가질 실제 방)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pen_id", nullable = false, unique = true)
    private Pen pen;

    private Integer gridRow;    // 시작 행 (grid-row-start)
    private Integer gridCol;    // 시작 열 (grid-column-start)
    private Integer rowSpan;    // 행 길이 (span)
    private Integer colSpan;    // 열 길이 (span)

    @Builder
    public PenLayout(Barn barn, Pen pen, Integer gridRow, Integer gridCol, Integer rowSpan, Integer colSpan) {
        this.barn = barn;
        this.pen = pen;
        this.gridRow = gridRow;
        this.gridCol = gridCol;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
    }

    public void updateLayout(Integer gridRow, Integer gridCol, Integer rowSpan, Integer colSpan) {
        this.gridRow = gridRow;
        this.gridCol = gridCol;
        this.rowSpan = rowSpan;
        this.colSpan = colSpan;
    }
}