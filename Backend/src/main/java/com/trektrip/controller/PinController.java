package com.trektrip.controller;

import com.trektrip.model.Pin;
import com.trektrip.service.LocationServiceImpl;
import com.trektrip.service.PinService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pin")
@AllArgsConstructor

public class PinController {
    private final LocationServiceImpl locationServiceImpl;
    private PinService pinService;
    @GetMapping("/all")
    public List<Pin> getAllPins() {
        return pinService.getPins();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pin> getPinById(@PathVariable Long id) {
        Optional<Pin> pinOptional = pinService.getPinById(id);
        if (pinOptional.isPresent()) {
            return ResponseEntity.ok(pinOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public  ResponseEntity<Pin> createPin(@RequestBody Pin pin){
        return new ResponseEntity<>(pinService.createPin(pin), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pin> updatePin(@RequestBody Pin pin, @PathVariable Long id){
        try {
            Pin updatedPin = (Pin) pinService.updatePin(pin, id);
            return new ResponseEntity<>(updatedPin, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePin(@PathVariable Long id) {
        pinService.deletePin(id);
        return ResponseEntity.noContent().build();
    }


}


