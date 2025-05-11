package com.trektrip.controller;

import com.trektrip.dto.TripRequestDTO;
import com.trektrip.model.Image;
import com.trektrip.model.Location;
import com.trektrip.model.Trip;
import com.trektrip.repository.ImageRepository;
import com.trektrip.repository.LocationRepository;
import com.trektrip.service.ImageService;
import com.trektrip.service.TripService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
@RequestMapping("/trip")
public class TripController {

    private TripService tripService;
    private ImageService imageService;
    private ImageRepository imageRepository;
    private LocationRepository locationRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Trip>> getAllTrip() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        Optional<Trip> optionaltrip = tripService.getTripById(id);
        if (optionaltrip.isPresent()) {
            return ResponseEntity.ok(optionaltrip.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody TripRequestDTO tripCreationRequest) {
        Trip trip = tripCreationRequest.getTrip();
        List<Long> imageIds = tripCreationRequest.getImageIds();
        List<Long> locationIds = tripCreationRequest.getLocationIds(); // New field for location IDs

        // Associate images with the trip
        List<Image> images = imageIds.stream()
                .map(imageId -> imageRepository.findById(imageId)
                        .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId)))
                .collect(Collectors.toList());
        trip.setImages(images);

        // Associate locations with the trip
        List<Location> locations = locationIds.stream()
                .map(locationId -> locationRepository.findById(locationId)
                        .orElseThrow(() -> new RuntimeException("Location not found with id: " + locationId)))
                .collect(Collectors.toList());
        trip.setLocations(locations);

        // Create the trip
        Trip createdTrip = tripService.createTrip(trip);

        return new ResponseEntity<>(createdTrip, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Trip> updateTrip(@RequestBody Trip trip, @PathVariable Long id) {
        try {
            Trip updatedTrip = tripService.updateTrip(trip, id);
            return new ResponseEntity<>(updatedTrip, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }
    
}
