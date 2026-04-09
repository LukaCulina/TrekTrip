package com.trektrip.repository;

import com.trektrip.controller.RatingController;
import com.trektrip.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
}
