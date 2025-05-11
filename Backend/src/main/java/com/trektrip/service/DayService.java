package com.trektrip.service;

import com.trektrip.model.Day;

import java.util.List;
import java.util.Optional;

public interface DayService {
    List<Day> getDays();

    Optional<Day> getDay(Long id);

    Day createDay(Day day);
    Day updateDay(Day day, Long id);
    void deleteDay(Long id);
}
