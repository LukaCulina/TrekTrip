package com.trektrip.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;
import com.trektrip.model.Country;
import com.trektrip.model.Location;
import com.trektrip.model.Pin;
import com.trektrip.service.LocationService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class LocationControllerTest {

    @Mock
    private LocationService locationService;

    @InjectMocks
    private LocationController locationController;
    private Location location;
    private Long locationId;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
        location = new Location(1L, "DestinationName", new Country(1L, "CountryName","feafea","feoa"), new Pin(1L, (float) 4134221L, (float) 23123L,"Descriptio1"));
        locationId = 1L;
    }

    @Test
    public void testGetAllLocations() throws Exception {
        Country country = new Country();
        Pin pin = new Pin();
        Location location1 = new Location(1L, "Location 1", country, pin);
        Location location2 = new Location(2L, "Location 2", country, pin);
        List<Location> allLocations = Arrays.asList(location1, location2);
        Mockito.when(locationService.getLocations()).thenReturn(allLocations);
        ResponseEntity<List<Location>> response = locationController.getAllLocations();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(allLocations,response.getBody());
    }

    @Test
    public void testGetLocationById() throws Exception {
        Long id = 1L;
        Country country = new Country();
        Pin pin = new Pin();
        Location location1 = new Location(1L, "Location 1", country, pin);

        Mockito.when(locationService.getLocation(id)).thenReturn(Optional.of(location1));

        ResponseEntity<Location> response = locationController.getLocationById(id);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(location1,response.getBody());
    }

    @Test
    public void testCreateLocation() throws Exception {
        // Arrange
        Mockito.when(locationService.createLocation(any(Location.class))).thenReturn(location);

        // Act
        ResponseEntity<Location> response = locationController.createLocation(location);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(location, response.getBody());
    }

    @Test
    public void testUpdateLocationSuccess() throws Exception {
        // Arrange
        Mockito.when(locationService.updateLocation(any(Location.class), eq(locationId))).thenReturn(location);

        // Act
        ResponseEntity<Location> response = locationController.updateLocation(location, locationId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(location, response.getBody());
    }

    @Test
    public void testUpdateLocationNotFound() throws Exception {
        // Arrange
        Mockito.when(locationService.updateLocation(any(Location.class), eq(locationId))).thenThrow(new EntityNotFoundException());

        // Act
        ResponseEntity<Location> response = locationController.updateLocation(location, locationId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    public void testDeleteLocation() throws Exception {
        // Arrange
        Long locationId = 1L;
        doNothing().when(locationService).deleteLocation(locationId);

        // Act
        ResponseEntity<Void> response = locationController.deleteLocation(locationId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }



}



