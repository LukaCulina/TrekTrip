package com.trektrip.controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.controller.CountryController;
import com.trektrip.model.Country;
import com.trektrip.service.CountryService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CountryController.class)
@AutoConfigureMockMvc(addFilters = false)
class CountryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CountryService countryService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    private Country country1;
    private Country country2;

    @BeforeEach
    void setUp() {
        country1 = new Country(1L, "Country1", "Continent1", "C1");
        country2 = new Country(2L, "Country2", "Continent2", "C2");
    }

    @Test
    void testCreateCountry() throws Exception {
        when(countryService.createCountry(any(Country.class))).thenReturn(country1);

        ResultActions response = mockMvc.perform(post("/country")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(country1)));

        response.andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists()) // Ensure id is returned
                .andExpect(jsonPath("$.name", CoreMatchers.is(country1.getName())))
                .andExpect(jsonPath("$.continent", CoreMatchers.is(country1.getContinent())))
                .andExpect(jsonPath("$.code", CoreMatchers.is(country1.getCode())));
    }

    @Test
    void testGetAllCountries() throws Exception {
        List<Country> allCountries = List.of(country1, country2);
        when(countryService.getAllCountries()).thenReturn(allCountries);

        ResultActions response = mockMvc.perform(get("/country/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", CoreMatchers.is(allCountries.size()))) // Check size of array
                .andExpect(jsonPath("$.[0].id").value(country1.getId().intValue())) // Check first element
                .andExpect(jsonPath("$.[0].name", CoreMatchers.is(country1.getName())))
                .andExpect(jsonPath("$.[0].continent", CoreMatchers.is(country1.getContinent())))
                .andExpect(jsonPath("$.[0].code", CoreMatchers.is(country1.getCode())))
                .andExpect(jsonPath("$.[1].id").value(country2.getId().intValue())) // Check second element
                .andExpect(jsonPath("$.[1].name", CoreMatchers.is(country2.getName())))
                .andExpect(jsonPath("$.[1].continent", CoreMatchers.is(country2.getContinent())))
                .andExpect(jsonPath("$.[1].code", CoreMatchers.is(country2.getCode())));
    }

    @Test
    @WithMockUser
    void testGetCountryByIdExists() throws Exception {
        Long id = 1L;
        when(countryService.getCountryById(id)).thenReturn(Optional.of(country1));

        ResultActions response = mockMvc.perform(get("/country/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(country1.getId().intValue()))
                .andExpect(jsonPath("$.name", CoreMatchers.is(country1.getName())))
                .andExpect(jsonPath("$.continent", CoreMatchers.is(country1.getContinent())))
                .andExpect(jsonPath("$.code", CoreMatchers.is(country1.getCode())));
    }

    @Test
    @WithMockUser
    void testGetCountryByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(countryService.getCountryById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/country/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void testUpdateCountry() throws Exception {
        Long id = 1L;
        when(countryService.updateCountry(any(Country.class), eq(id))).thenReturn(country2);

        ResultActions response = mockMvc.perform(put("/country/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(country2)));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(country2.getId().intValue()))
                .andExpect(jsonPath("$.name", CoreMatchers.is(country2.getName())))
                .andExpect(jsonPath("$.continent", CoreMatchers.is(country2.getContinent())))
                .andExpect(jsonPath("$.code", CoreMatchers.is(country2.getCode())));
    }

    @Test
    @WithMockUser
    void testUpdateCountry_NotFound() throws Exception {
        Long id = 3L;
        when(countryService.updateCountry(any(Country.class), eq(id))).thenThrow(EntityNotFoundException.class);

        ResultActions response = mockMvc.perform(put("/country/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(country2)));

        response.andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void testDeleteCountry() throws Exception {
        Long id = 1L;
        doNothing().when(countryService).deleteCountry(id);

        ResultActions response = mockMvc.perform(delete("/country/{id}", id)
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isNoContent());
    }
}
