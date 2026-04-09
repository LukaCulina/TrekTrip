package com.trektrip.service;

import com.trektrip.model.Country;
import com.trektrip.repository.CountryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class CountryServiceImpl implements CountryService{

    private CountryRepository countryRepository;

    @Override
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @Override
    public Optional<Country> getCountryById(Long id) {
        return countryRepository.findById(id);
    }

    @Override
    public Country createCountry(Country country) {
        return countryRepository.save(country);
    }

    @Override
    public Country updateCountry(Country country, Long id) {
        Optional<Country> optionalCountry = countryRepository.findById(id);

        if(optionalCountry.isPresent()) {
            country.setId(id);
            return countryRepository.save(country);
        }
        else {
            throw new EntityNotFoundException("Country with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteCountry(Long id) {
        countryRepository.deleteById(id);
    }
}
