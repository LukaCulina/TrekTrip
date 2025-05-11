package com.trektrip.service;

import com.trektrip.model.Trip;
import com.trektrip.repository.TripRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class TripServiceImpl implements TripService{

    private TripRepository tripRepository;

    @Override
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Override
    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    @Override
    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    @Override
    public Trip updateTrip(Trip trip, Long id) {
        Optional<Trip> optionalTrip = tripRepository.findById(id);

        if (optionalTrip.isPresent()) {
            trip.setId(id);
            return tripRepository.save(trip);
        } else {
            throw new EntityNotFoundException("Trip with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
    
}
