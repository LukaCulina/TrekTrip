package com.trektrip.controller;

import com.trektrip.model.Pin;
import com.trektrip.service.PinService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
public class PinControllerTest {

    @Mock
    private PinService pinService;

    @InjectMocks
    private PinController pinController;

    private Pin pin;
    private Long pinId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        pinId = 1L;
        pin = new Pin(pinId, 123.45f, 678.90f, "Sample Description");
    }

    @Test
    public void testGetAllPins() {
        // Arrange
        List<Pin> allPins = Arrays.asList(pin);
        given(pinService.getPins()).willReturn(allPins);

        // Act
        List<Pin> response = pinController.getAllPins();

        // Assert
        assertEquals(allPins, response);
    }

    @Test
    public void testGetPinByIdFound() {
        // Arrange
        given(pinService.getPinById(pinId)).willReturn(Optional.of(pin));

        // Act
        ResponseEntity<Pin> response = pinController.getPinById(pinId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pin, response.getBody());
    }

    @Test
    public void testGetPinByIdNotFound() {
        // Arrange
        given(pinService.getPinById(pinId)).willReturn(Optional.empty());

        // Act
        ResponseEntity<Pin> response = pinController.getPinById(pinId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testCreatePin() {
        // Arrange
        given(pinService.createPin(any(Pin.class))).willReturn(pin);

        // Act
        ResponseEntity<Pin> response = pinController.createPin(pin);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(pin, response.getBody());
    }

    @Test
    public void testUpdatePinSuccess() {
        // Arrange
        given(pinService.updatePin(any(Pin.class), eq(pinId))).willReturn(pin);

        // Act
        ResponseEntity<Pin> response = pinController.updatePin(pin, pinId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(pin, response.getBody());
    }

    @Test
    public void testUpdatePinNotFound() {
        // Arrange
        willThrow(new EntityNotFoundException()).given(pinService).updatePin(any(Pin.class), eq(pinId));

        // Act
        ResponseEntity<Pin> response = pinController.updatePin(pin, pinId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeletePin() {
        // Arrange
        willDoNothing().given(pinService).deletePin(pinId);

        // Act
        ResponseEntity<Void> response = pinController.deletePin(pinId);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}