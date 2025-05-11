package com.trektrip.service;

import com.trektrip.model.Trip;
import com.trektrip.repository.TripRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TripServiceImplTest {
    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripServiceImpl tripService;

    @Test
    public void testCreateTrip() {
        Trip trip = new Trip(1L, "Naslov 1", "Opis 1", 3, true);

        when(tripRepository.save(Mockito.any(Trip.class))).thenReturn(trip);

        Trip savedTrip = tripService.createTrip(trip);

        Assertions.assertNotNull(savedTrip);

    }

    @Test
    public void testGetAllTrips() {
        Trip trip1 = new Trip(1L, "Naslov 1", "Opis 1", 3, true);
        Trip trip2 = new Trip(2L, "Naslov 2", "Opis 2", 5, false);

        List<Trip> allTrips = List.of(trip1, trip2);

        when(tripRepository.findAll()).thenReturn(allTrips);

        Assertions.assertNotNull(tripRepository.findAll());
    }

    @Test
    public void testTripByIdExists() {
        Long id = 1L;
        Trip trip = new Trip(1L, "Naslov 1", "Opis 1", 3, true);
        when(tripRepository.findById(id)).thenReturn(Optional.of(trip));

        Optional<Trip> tripReturn = tripService.getTripById(id);

        Assertions.assertNotNull(tripReturn.get());
    }

    @Test
    public void testTripByIdDoesntExist() {
        Long id = 2L;
        when(tripRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Trip> tripReturn = tripService.getTripById(id);

        Assertions.assertTrue(tripReturn.isEmpty());
    }

    @Test
    public void testUpdateTrip() {
        Long id = 1L;
        Trip trip1 = new Trip(1L, "Naslov 1", "Opis 1", 3, true);
        Trip trip2 = new Trip(2L, "Naslov 2", "Opis 2", 5, false);

        when(tripRepository.findById(id)).thenReturn(Optional.of(trip1));
        when(tripRepository.save(trip2)).thenReturn(trip2);

        Trip updateReturn = tripService.updateTrip(trip2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateTripIfDoesntExist() {
        Long id = 3L;
        Trip trip2 = new Trip(2L, "Naslov 2", "Opis 2", 5, false);

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            Trip updatedTrip = tripService.updateTrip(trip2, id);
        });
    }

    @Test
    public void testDeleteTrip() {
        Long id = 1L;

        tripService.deleteTrip(id);
        verify(tripRepository).deleteById(id);
    }
}