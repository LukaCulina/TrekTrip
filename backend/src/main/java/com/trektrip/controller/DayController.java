package com.trektrip.controller;

import com.trektrip.dto.DayRequestDTO;
import com.trektrip.model.Day;
import com.trektrip.model.Trip;
import com.trektrip.repository.TripRepository;
import com.trektrip.repository.DayRepository;
import com.trektrip.service.DayService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/day")
@AllArgsConstructor
public class DayController {

    private final DayService dayService;
    private final TripRepository tripRepository;
    private final DayRepository dayRepository;

    @GetMapping("/all")
    public List<Day> getAllDays() {
        return dayService.getDays();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Day> getDayById(@PathVariable Long id) {
        Optional<Day> dayOptional = dayService.getDay(id);
        if (dayOptional.isPresent()) {
            return ResponseEntity.ok(dayOptional.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Day>> getDaysByTripId(@PathVariable Long tripId) {
        return ResponseEntity.ok(dayRepository.findByTripId(tripId));
    }

    @PostMapping
    public ResponseEntity<Long> createDay(@RequestBody DayRequestDTO dayRequest) {
        Day day = new Day();
        day.setTitle(dayRequest.getTitle());
        day.setText(dayRequest.getText());

        Trip trip = tripRepository.findById(dayRequest.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + dayRequest.getTripId()));
        day.setTrip(trip);

        Day createdDay = dayService.createDay(day);
        return new ResponseEntity<>(createdDay.getId(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Day> updateDay(@RequestBody Day day, @PathVariable Long id) {
        try {
            Day updatedDay = dayService.updateDay(day, id);
            return new ResponseEntity<>(updatedDay, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDay(@PathVariable Long id) {
        dayService.deleteDay(id);
        return ResponseEntity.noContent().build();
    }
}
