package com.trektrip.service;

import com.trektrip.model.Trip;

import java.util.List;
import java.util.Optional;

public interface TripService {

    List<Trip> getAllTrips();
    Optional<Trip> getTripById(Long id);
    Trip createTrip(Trip trip);
    Trip updateTrip(Trip trip, Long id);
    void deleteTrip(Long id);
    
}
