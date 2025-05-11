package com.trektrip.service;

import com.trektrip.model.Pin;
import com.trektrip.repository.PinRepository;
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
class PinServiceImplTest {
    @Mock
    private PinRepository pinRepository;

    @InjectMocks
    private PinServiceImpl pinService;

    @Test
    public void testCreatePin() {
        Pin pin = new Pin(1L, 30.2445f, 25.3634f, "Dest 1");

        when(pinRepository.save(Mockito.any(Pin.class))).thenReturn(pin);

        Pin savedPin = pinService.createPin(pin);

        assertNotNull(savedPin);

    }

    @Test
    public void testGetAllPins() {
        Pin pin1 = new Pin(1L, 30.2445f, 25.3634f, "Dest 1");
        Pin pin2 = new Pin(2L, 32.2445f, 27.3634f, "Dest 2");

        List<Pin> allPins = List.of(pin1, pin2);

        when(pinRepository.findAll()).thenReturn(allPins);

        assertNotNull(pinRepository.findAll());
    }

    @Test
    public void testPinByIdExists() {
        Long id = 1L;
        Pin pin = new Pin(1L, 30.2445f, 25.3634f, "Dest 1");
        when(pinRepository.findById(id)).thenReturn(Optional.of(pin));

        Optional<Pin> pinReturn = pinService.getPinById(id);

        assertNotNull(pinReturn.get());
    }

    @Test
    public void testPinByIdDoesntExist() {
        Long id = 2L;
        when(pinRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Pin> pinReturn = pinService.getPinById(id);

        assertTrue(pinReturn.isEmpty());
    }

    @Test
    public void testUpdatePin() {
        Long id = 1L;
        Pin pin1 = new Pin(1L, 30.2445f, 25.3634f, "Dest 1");
        Pin pin2 = new Pin(2L, 32.2445f, 27.3634f, "Dest 2");

        when(pinRepository.findById(id)).thenReturn(Optional.of(pin1));
//        when(pinRepository.save(pin2)).thenReturn(pin2);

        Pin updateReturn = pinService.updatePin(pin2, id);

        verify(pinRepository).save(pin2);
    }

    @Test
    public void testUpdatePinIfDoesntExist() {
        Long id = 3L;
        Pin pin2 = new Pin(2L, 32.2445f, 27.3634f, "Dest 2");

        assertThrows(EntityNotFoundException.class, () -> {
            Pin updatedPin = pinService.updatePin(pin2, id);
        });
    }

    @Test
    public void testDeletePin() {
        Long id = 1L;

        pinService.deletePin(id);
        verify(pinRepository).deleteById(id);
    }
}