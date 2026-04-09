package com.trektrip.service;

import com.trektrip.model.Day;
import com.trektrip.repository.DayRepository;
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

@ExtendWith(MockitoExtension.class)
class DayServiceImplTest {

    @Mock
    private DayRepository dayRepository;

    @InjectMocks
    private DayServiceImpl dayService;

    @Test
    public void testCreateDay() {
        Day day = new Day(1L, "Title1", "Text1");

        when(dayRepository.save(Mockito.any(Day.class))).thenReturn(day);

        Day savedDay = dayService.createDay(day);

        Assertions.assertNotNull(savedDay);
    }

    @Test
    public void testGetAllDays() {
        Day day1 = new Day(1L, "Title1", "Text1");
        Day day2 = new Day(2L, "Title2", "Text2");

        List<Day> allDays = List.of(day1, day2);

        when(dayRepository.findAll()).thenReturn(allDays);

        List<Day> days = dayService.getDays();

        Assertions.assertNotNull(days);
        Assertions.assertEquals(2, days.size());
    }

    @Test
    public void testDayByIdExists() {
        Long id = 1L;
        Day day = new Day(id, "Title1", "Text1");
        when(dayRepository.findById(id)).thenReturn(Optional.of(day));

        Optional<Day> dayReturn = dayService.getDay(id);

        Assertions.assertTrue(dayReturn.isPresent());
    }

    @Test
    public void testDayByIdDoesntExist() {
        Long id = 2L;
        when(dayRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Day> dayReturn = dayService.getDay(id);

        Assertions.assertTrue(dayReturn.isEmpty());
    }

    @Test
    public void testUpdateDay() {
        Long id = 1L;
        Day existingDay = new Day(id, "Title1", "Text1");
        Day updatedDay = new Day(id, "UpdatedTitle", "UpdatedText");

        when(dayRepository.findById(id)).thenReturn(Optional.of(existingDay));
        when(dayRepository.save(Mockito.any(Day.class))).thenReturn(updatedDay);

        Day updatedDayReturn = dayService.updateDay(updatedDay, id);

        Assertions.assertNotNull(updatedDayReturn);
        Assertions.assertEquals(updatedDay.getTitle(), updatedDayReturn.getTitle());
    }

    @Test
    public void testUpdateDayIfDoesntExist() {
        Long id = 3L;
        Day updatedDay = new Day(id, "UpdatedTitle", "UpdatedText");

        when(dayRepository.findById(id)).thenReturn(Optional.empty());

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            dayService.updateDay(updatedDay, id);
        });
    }

    @Test
    public void testDeleteDay() {
        Long id = 1L;

        dayService.deleteDay(id);

        verify(dayRepository).deleteById(id);
    }
}
