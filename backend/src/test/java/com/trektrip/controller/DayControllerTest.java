package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.dto.DayRequestDTO;
import com.trektrip.model.Day;
import com.trektrip.service.DayService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = DayController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class DayControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DayService dayService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllDays() throws Exception {
        List<Day> days = new ArrayList<>();
        days.add(new Day(1L, "Title1", "Text1"));
        days.add(new Day(2L, "Title2", "Text2"));

        when(dayService.getDays()).thenReturn(days);

        mockMvc.perform(MockMvcRequestBuilders.get("/day/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void testGetDayById() throws Exception {
        Long dayId = 1L;
        Day day = new Day(dayId, "Title1", "Text1");

        when(dayService.getDay(dayId)).thenReturn(Optional.of(day));

        mockMvc.perform(MockMvcRequestBuilders.get("/day/{id}", dayId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(dayId));
    }

    @Test
    public void testCreateDay() throws Exception {
        DayRequestDTO dayRequestDTO = new DayRequestDTO();
        dayRequestDTO.setTitle("Title1");
        dayRequestDTO.setText("Text1");
        dayRequestDTO.setTripId(1L);

        Day createdDay = new Day(1L, "Title1", "Text1");

        when(dayService.createDay(any(Day.class))).thenReturn(createdDay);

        mockMvc.perform(MockMvcRequestBuilders.post("/day")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dayRequestDTO)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value(dayRequestDTO.getTitle()));
    }

    @Test
    public void testUpdateDay() throws Exception {
        Long dayId = 1L;
        Day updatedDay = new Day(dayId, "UpdatedTitle", "UpdatedText");

        when(dayService.updateDay(any(Day.class), any(Long.class))).thenReturn(updatedDay);

        mockMvc.perform(MockMvcRequestBuilders.put("/day/{id}", dayId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDay)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value(dayId));
    }

    @Test
    public void testDeleteDay() throws Exception {
        Long dayId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.delete("/day/{id}", dayId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
