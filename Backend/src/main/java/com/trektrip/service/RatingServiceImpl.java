package com.trektrip.service;

import com.trektrip.model.Rating;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.RatingRepository;
import com.trektrip.repository.TripRepository;
import com.trektrip.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class RatingServiceImpl implements RatingService{

    private RatingRepository ratingRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userInfoRepository;

    @Override
    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    @Override
    public Optional<Rating> getRatingById(Long id) {
        return ratingRepository.findById(id);
    }

    @Override
    public Rating createRating(Rating rating) {

        Trip trip = tripRepository.findById(rating.getTrip().getId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        UserInfo user = userInfoRepository.findById(rating.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        rating.setTrip(trip);
        rating.setUser(user);

        return ratingRepository.save(rating);    }

    @Override
    public Rating updateRating(Rating rating, Long id) {
        Optional<Rating> optionalRating = ratingRepository.findById(id);

        if (optionalRating.isPresent()) {
            rating.setId(id);
            return ratingRepository.save(rating);
        } else {
            throw new EntityNotFoundException("Rating with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
    
}
