package com.trektrip.service;

import com.trektrip.model.Day;
import com.trektrip.repository.DayRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DayServiceImpl implements DayService {

    private final DayRepository dayRepository;

    @Override
    public List<Day> getDays() {
        return dayRepository.findAll();
    }

    @Override
    public Optional<Day> getDay(Long id) {
        return dayRepository.findById(id);
    }

    @Override
    public Day createDay(Day day) {
        return dayRepository.save(day);
    }

    @Override
    public Day updateDay(Day day, Long id) {
        Optional<Day> dayOptional = dayRepository.findById(id);
        if (dayOptional.isPresent()) {
            Day dayToUpdate = dayOptional.get();
            dayToUpdate.setTitle(day.getTitle());
            dayToUpdate.setText(day.getText());
            return dayRepository.save(dayToUpdate);
        } else {
            throw new EntityNotFoundException("Day with the ID '" + id + "' not found");
        }
    }

    @Override
    public void deleteDay(Long id) {
        dayRepository.deleteById(id);
    }

}
