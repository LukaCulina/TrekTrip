package com.trektrip.service;

import com.trektrip.model.Country;

import java.util.List;
import java.util.Optional;

public interface CountryService {
    List<Country> getAllCountries();
    Optional<Country> getCountryById(Long id);
    Country createCountry(Country country);
    Country updateCountry(Country country, Long id);
    void deleteCountry(Long id);
}
