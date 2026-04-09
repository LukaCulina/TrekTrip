package com.trektrip.service;

import com.trektrip.model.Rating;

import java.util.List;
import java.util.Optional;

public interface RatingService {

    List<Rating> getAllRatings();
    Optional<Rating> getRatingById(Long id);
    Rating createRating(Rating rating);
    Rating updateRating(Rating rating, Long id);
    void deleteRating(Long id);
    
}
