package com.trektrip.service;

import com.trektrip.model.Location;
import com.trektrip.repository.LocationRepository;
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

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class LocationServiceImplTest {
    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocationServiceImpl locationService;

    @Test
    public void testCreateLocation() {
        Location location = new Location(1L, "Dest 1");

        when(locationRepository.save(Mockito.any(Location.class))).thenReturn(location);

        Location savedLocation = locationService.createLocation(location);

        assertNotNull(savedLocation);

    }

    @Test
    public void testGetAllLocations() {
        Location location1 = new Location(1L, "Dest 1");
        Location location2 = new Location(2L, "Dest 2");

        List<Location> allLocations = List.of(location1, location2);

        when(locationRepository.findAll()).thenReturn(allLocations);

        assertNotNull(locationRepository.findAll());
    }

    @Test
    public void testLocationByIdExists() {
        Long id = 1L;
        Location location = new Location(1L, "Dest 1");
        when(locationRepository.findById(id)).thenReturn(Optional.of(location));

        Optional<Location> locationReturn = locationService.getLocation(id);

        assertNotNull(locationReturn.get());
    }

    @Test
    public void testLocationByIdDoesntExist() {
        Long id = 2L;
        when(locationRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Location> locationReturn = locationService.getLocation(id);

        assertTrue(locationReturn.isEmpty());
    }

    @Test
    public void testUpdateLocation() {
        Long id = 1L;
        Location location1 = new Location(1L, "Dest 1");
        Location location2 = new Location(1L, "Dest 2");

        when(locationRepository.findById(id)).thenReturn(Optional.of(location1));
//        when(locationRepository.save(location2)).thenReturn(location2);

        Location updateReturn = locationService.updateLocation(location2, id);

        verify(locationRepository).save(location2);
    }

    @Test
    public void testUpdateLocationIfDoesntExist() {
        Long id = 3L;
        Location location2 = new Location(2L, "Dest 2");

        assertThrows(EntityNotFoundException.class, () -> {
            Location updatedLocation = locationService.updateLocation(location2, id);
        });
    }

    @Test
    public void testDeleteLocation() {
        Long id = 1L;

        locationService.deleteLocation(id);
        verify(locationRepository).deleteById(id);
    }
}