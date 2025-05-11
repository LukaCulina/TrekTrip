package com.trektrip.dto;

import com.trektrip.model.Trip;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TripRequestDTO {
    private Trip trip;
    private List<Long> imageIds;
    private List<Long> locationIds;
}
