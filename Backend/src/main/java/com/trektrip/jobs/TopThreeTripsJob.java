package com.trektrip.jobs;

import com.trektrip.model.Rating;
import com.trektrip.model.Trip;
import com.trektrip.repository.RatingRepository;
import com.trektrip.repository.TripRepository;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class TopThreeTripsJob extends QuartzJobBean {

    private final Logger log = LoggerFactory.getLogger(TopThreeTripsJob.class);

    private final TripRepository tripRepository;
    private final RatingRepository ratingRepository;

    public TopThreeTripsJob(TripRepository tripRepository, RatingRepository ratingRepository) {
        this.tripRepository = tripRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        List<Trip> topTrips = new ArrayList<>();
        List<Rating> ratings = ratingRepository.findAll();
        ratings.sort(Rating::compareTo);
        Collections.reverse(ratings);

        if (!ratings.isEmpty()) {
            for (int i = 0; i < 3; i++) {
                topTrips.add(tripRepository.findById(ratings.get(i).getTrip().getId()).get());
            }
            log.info("Top 3 best rated trips:");
            for (int i = 0; i < 3; i++) {
                log.info(topTrips.get(i) + ", Rating: " + ratings.get(i).getRating());
            }
        } else {
            log.info("No available trips!");
        }

    }
}
