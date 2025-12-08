package com.madebyzino.Woojik.dto.livestock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LivestockMoveRequest {
    private Long destinationPenId;
}