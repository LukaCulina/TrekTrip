package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.dto.TripRequestDTO;
import com.trektrip.model.Image;
import com.trektrip.model.Location;
import com.trektrip.model.Trip;
import com.trektrip.repository.ImageRepository;
import com.trektrip.repository.LocationRepository;
import com.trektrip.repository.TripRepository;
import com.trektrip.service.ImageService;
import com.trektrip.service.TripService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = TripController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class TripControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TripService tripService;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    @MockBean
    private ImageService imageService;
    @MockBean
    private ImageRepository imageRepository;
    @MockBean
    private LocationRepository locationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Trip trip1;
    private Trip trip2;

    @BeforeEach
    public void init() {
        trip1 = new Trip(1L, "Naslov 1", "Opis 1", 3, true);
        trip2 = new Trip(2L, "Naslov 2", "Opis 2", 5, false);
    }

    @Test
    @WithMockUser
    public void testCreateTrip() throws Exception{
        TripRequestDTO tripRequestDTO = new TripRequestDTO(trip1, Arrays.asList(1L), Arrays.asList(1L));
        Image image1 = new Image(1L, "url1");
        Location location1 = new Location(1L, "dest 1");

        given(tripService.createTrip(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));
        when(imageRepository.findById(1L)).thenReturn(Optional.of(image1));
        when(locationRepository.findById(1L)).thenReturn(Optional.of(location1));

        ResultActions response = mockMvc.perform(post("/trip")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tripRequestDTO)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title", CoreMatchers.is(trip1.getTitle())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description", CoreMatchers.is(trip1.getDescription())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lengthInDays", CoreMatchers.is(trip1.getLengthInDays())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.public", CoreMatchers.is(trip1.isPublic())));

    }

    @Test
    @WithMockUser
    public void testGetAllTrips() throws Exception {
        List<Trip> allTrips = List.of(trip1, trip2);
        when(tripService.getAllTrips()).thenReturn(allTrips);

        ResultActions response = mockMvc.perform(get("/trip/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allTrips.size())));

    }

    @Test
    @WithMockUser
    public void testGetTripByIdIfExists() throws Exception {
        Long id = 1L;
        when(tripService.getTripById(id)).thenReturn(Optional.of(trip1));

        ResultActions response = mockMvc.perform(get("/trip/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(trip1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title", CoreMatchers.is(trip1.getTitle())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description", CoreMatchers.is(trip1.getDescription())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lengthInDays", CoreMatchers.is(trip1.getLengthInDays())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.public", CoreMatchers.is(trip1.isPublic())));
    }

    @Test
    @WithMockUser
    public void testGetTripByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(tripService.getTripById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/trip/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateTrip() throws Exception {
        Long id = 1L;
        when(tripService.updateTrip(trip2, id)).thenReturn(trip2);

        ResultActions response = mockMvc.perform(put("/trip/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(trip2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title", CoreMatchers.is(trip2.getTitle())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description", CoreMatchers.is(trip2.getDescription())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lengthInDays", CoreMatchers.is(trip2.getLengthInDays())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.public", CoreMatchers.is(trip2.isPublic())));
    }

    @Test
    @WithMockUser
    public void testDeleteTrip() throws Exception {
        Long id = 1L;
        doNothing().when(tripService).deleteTrip(id);

        ResultActions response = mockMvc.perform(delete("/trip/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

}