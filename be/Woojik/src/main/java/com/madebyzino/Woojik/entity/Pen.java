package com.madebyzino.Woojik.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
@Table(name = "pens")
public class Pen extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 예: 101호

    private Integer capacity; // 적정 수용 두수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barn_id")
    private Barn barn;

    public Pen(String name, Integer capacity, Barn barn) {
        this.name = name;
        this.capacity = capacity;
        this.barn = barn;
    }
}