package com.trektrip.service;

import com.trektrip.model.Location;
import com.trektrip.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class LocationServiceImpl implements LocationService {

    private LocationRepository locationRepository;

    @Override
    public List<Location> getLocations() {
        return locationRepository.findAll();
    }

    @Override
    public Optional<Location> getLocation(Long id) {
        return locationRepository.findById(id);
    }

    @Override
    public Location createLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Location updateLocation(Location location, Long id) {
        Optional<Location> locationOptional = locationRepository.findById(id);
        if (locationOptional.isPresent()) {
            Location locationToUpdate = locationOptional.get();
            locationToUpdate.setDestination(location.getDestination());
            return locationRepository.save(locationToUpdate);
        } else {
            throw new EntityNotFoundException("Location with the ID '"+ id + "' not found");

        }

    }

    @Override
    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }
}
