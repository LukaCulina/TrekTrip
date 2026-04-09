package com.trektrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RatingRequestDTO {
    private Long tripId;
    private Long userId;
    private double rating;
}
