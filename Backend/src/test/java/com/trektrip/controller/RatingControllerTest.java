package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.Rating;
import com.trektrip.service.JwtService;
import com.trektrip.service.RatingService;
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

import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = RatingController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class RatingControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RatingService ratingService;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private Rating rating1;
    private Rating rating2;

    @BeforeEach
    public void init() {
        rating1 = new Rating(1L, 3);
        rating2 = new Rating(2L,  5);
    }

    @Test
    @WithMockUser
    public void testCreateRating() throws Exception{
        given(ratingService.createRating(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        ResultActions response = mockMvc.perform(post("/rating")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rating1)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.rating", CoreMatchers.is(rating1.getRating())));

    }

    @Test
    @WithMockUser
    public void testGetAllRatings() throws Exception {
        List<Rating> allRatings = List.of(rating1, rating2);
        when(ratingService.getAllRatings()).thenReturn(allRatings);

        ResultActions response = mockMvc.perform(get("/rating/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allRatings.size())));

    }

    @Test
    @WithMockUser
    public void testGetRatingByIdIfExists() throws Exception {
        Long id = 1L;
        when(ratingService.getRatingById(id)).thenReturn(Optional.of(rating1));

        ResultActions response = mockMvc.perform(get("/rating/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rating1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.rating", CoreMatchers.is(rating1.getRating())));
    }

    @Test
    @WithMockUser
    public void testGetRatingByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(ratingService.getRatingById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/rating/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateRating() throws Exception {
        Long id = 1L;
        when(ratingService.updateRating(rating2, id)).thenReturn(rating2);

        ResultActions response = mockMvc.perform(put("/rating/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rating2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.rating", CoreMatchers.is(rating2.getRating())));
    }

    @Test
    @WithMockUser
    public void testDeleteRating() throws Exception {
        Long id = 1L;
        doNothing().when(ratingService).deleteRating(id);

        ResultActions response = mockMvc.perform(delete("/rating/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

}