package com.trektrip.service;

import com.trektrip.model.Pin;

import java.util.List;
import java.util.Optional;

public interface PinService {
    List<Pin> getPins();
    Optional<Pin> getPinById(Long id);
    Pin createPin(Pin pin);
    Pin updatePin(Pin pin,Long id);
    void deletePin(Long id);
}



//
//
//
//Location createLocation(Location location);
//Location updateLocation(Location location, Long id);
//void deleteLocation(Long id);