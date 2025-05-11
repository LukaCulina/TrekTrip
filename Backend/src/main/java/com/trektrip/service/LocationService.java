package com.trektrip.service;

import com.trektrip.model.Location;

import java.util.List;
import java.util.Optional;

public interface LocationService {

    List<Location> getLocations();

    Optional<Location> getLocation(Long id);

    Location createLocation(Location location);
    Location updateLocation(Location location, Long id);
    void deleteLocation(Long id);
}
