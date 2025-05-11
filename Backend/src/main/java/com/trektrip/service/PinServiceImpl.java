package com.trektrip.service;

import com.trektrip.model.Pin;
import com.trektrip.repository.PinRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor

public class PinServiceImpl implements PinService {
    private PinRepository pinRepository;



    @Override
    public List<Pin> getPins() {
        return pinRepository.findAll();
    }

    @Override
    public Optional<Pin> getPinById(Long id) {
        return pinRepository.findById(id);
    }

    @Override
    public Pin createPin(Pin pin) {
        return pinRepository.save(pin);
    }


    @Override
    public Pin updatePin(Pin pin, Long id) {
       Optional<Pin> pinOptional = pinRepository.findById(id);
       if(pinOptional.isPresent()){
         pin.setId(id);
           return pinRepository.save(pin);
       } else {
           throw  new EntityNotFoundException("Location with the ID '"+ id + "' not found");
       }
    }

    @Override
    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }


}
