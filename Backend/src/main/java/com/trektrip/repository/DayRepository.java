package com.trektrip.repository;

import com.trektrip.model.Day;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DayRepository extends JpaRepository<Day, Long> {
    List<Day> findByTripId(Long tripId);
}
