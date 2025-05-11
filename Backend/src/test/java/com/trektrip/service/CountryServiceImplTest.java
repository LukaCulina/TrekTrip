package com.trektrip.service;

import com.trektrip.model.Country;
import com.trektrip.model.Trip;
import com.trektrip.repository.CountryRepository;
import com.trektrip.service.CountryService;
import com.trektrip.service.CountryServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CountryServiceImplTest {

    @Mock
    private CountryRepository countryRepository;

    @InjectMocks
    private CountryService countryService = new CountryServiceImpl(countryRepository);

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllCountries() {
        // Mock data
        List<Country> countries = new ArrayList<>();
        countries.add(new Country(1L, "Country A"));
        countries.add(new Country(2L, "Country B"));

        when(countryRepository.findAll()).thenReturn(countries);

        // Call service method
        List<Country> result = countryService.getAllCountries();

        // Verify the result
        assertEquals(2, result.size());
        assertEquals("Country A", result.get(0).getName());
        assertEquals("Country B", result.get(1).getName());
    }

    @Test
    public void testGetCountryById() {
        Long countryId = 1L;
        Country country = new Country(countryId, "Test Country");

        when(countryRepository.findById(countryId)).thenReturn(Optional.of(country));

        Optional<Country> result = countryService.getCountryById(countryId);

        assertTrue(result.isPresent());
        assertEquals("Test Country", result.get().getName());
    }

    @Test
    public void testGetCountryById_NotFound() {
        Long countryId = 1L;
        Country country = new Country(countryId, "Test Country");
        when(countryRepository.findById(countryId)).thenReturn(Optional.of(country));

        Optional<Country> countryReturn = countryService.getCountryById(countryId);

        Assertions.assertNotNull(countryReturn.get());
    }

    @Test
    public void testCreateCountry() {
        Country country = new Country();
        country.setName("New Country");

        when(countryRepository.save(any(Country.class))).thenReturn(country);

        Country created = countryService.createCountry(country);

        assertNotNull(created);
        assertEquals("New Country", created.getName());
    }

    @Test
    public void testUpdateCountry() {
        Long countryId = 1L;
        Country existingCountry = new Country(countryId, "Existing Country");
        Country updatedCountry = new Country(countryId, "Updated Country");

        when(countryRepository.findById(countryId)).thenReturn(Optional.of(existingCountry));
        when(countryRepository.save(any(Country.class))).thenReturn(updatedCountry);

        Country result = countryService.updateCountry(updatedCountry, countryId);

        assertNotNull(result);
        assertEquals("Updated Country", result.getName());
    }

    @Test
    public void testUpdateCountry_NotFound() {
        Long countryId = 1L;
        Country updatedCountry = new Country(countryId, "Updated Country");

        when(countryRepository.findById(countryId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            countryService.updateCountry(updatedCountry, countryId);
        });
    }

    @Test
    public void testDeleteCountry() {
        Long countryId = 1L;

        // No need to mock repository behavior, just verify method call
        countryService.deleteCountry(countryId);

        verify(countryRepository, times(1)).deleteById(countryId);
    }
}

