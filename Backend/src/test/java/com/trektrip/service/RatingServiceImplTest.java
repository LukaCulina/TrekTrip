package com.trektrip.service;

import com.trektrip.model.Rating;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.RatingRepository;
import com.trektrip.repository.TripRepository;
import com.trektrip.repository.UserRepository;
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
class RatingServiceImplTest {
    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserRepository userRepository;


    @InjectMocks
    private RatingServiceImpl ratingService;

    @Test
    public void testCreateRating() {
        Trip testTrip = new Trip(1L, "Trip 1", "Desc 1", 2, true);
        UserInfo testUser = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
        Rating rating = new Rating(1L, testTrip, testUser,5);

        when(ratingRepository.save(Mockito.any(Rating.class))).thenReturn(rating);
        when(tripRepository.findById(1L)).thenReturn(Optional.of(testTrip));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        Rating savedRating = ratingService.createRating(rating);

        Assertions.assertNotNull(savedRating);

    }

    @Test
    public void testGetAllRatings() {
        Rating rating1 = new Rating(1L, 5);
        Rating rating2 = new Rating(2L, 3);

        List<Rating> allRatings = List.of(rating1, rating2);

        when(ratingRepository.findAll()).thenReturn(allRatings);

        Assertions.assertNotNull(ratingRepository.findAll());
    }

    @Test
    public void testRatingByIdExists() {
        Long id = 1L;
        Rating rating = new Rating(1L, 5);
        when(ratingRepository.findById(id)).thenReturn(Optional.of(rating));

        Optional<Rating> ratingReturn = ratingService.getRatingById(id);

        Assertions.assertNotNull(ratingReturn.get());
    }

    @Test
    public void testRatingByIdDoesntExist() {
        Long id = 2L;
        when(ratingRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Rating> ratingReturn = ratingService.getRatingById(id);

        Assertions.assertTrue(ratingReturn.isEmpty());
    }

    @Test
    public void testUpdateRating() {
        Long id = 1L;
        Rating rating1 = new Rating(1L, 5);
        Rating rating2 = new Rating(2L, 3);

        when(ratingRepository.findById(id)).thenReturn(Optional.of(rating1));
        when(ratingRepository.save(rating2)).thenReturn(rating2);

        Rating updateReturn = ratingService.updateRating(rating2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateRatingIfDoesntExist() {
        Long id = 3L;
        Rating rating2 = new Rating(2L, 3);

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            Rating updatedRating = ratingService.updateRating(rating2, id);
        });
    }

    @Test
    public void testDeleteRating() {
        Long id = 1L;

        ratingService.deleteRating(id);
        verify(ratingRepository).deleteById(id);
    }
}