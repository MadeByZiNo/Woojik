package com.madebyzino.Woojik.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "barns")
public class Barn extends BaseTimeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // 예: 제1축사

    @OneToMany(mappedBy = "barn", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pen> pens = new ArrayList<>();

    public Barn(String name) {
        this.name = name;
    }
}