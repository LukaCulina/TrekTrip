package com.trektrip.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequestDTO {
    private String content;
    private Long tripId;
    private Long userId;
}
