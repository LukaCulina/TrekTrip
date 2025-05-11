package com.trektrip.configuration;

import com.trektrip.jobs.TopThreeTripsJob;
import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SchedulerConfig {

    private static final String TOP_TRIPS_JOB_IDENTITY = "topThreeTripsJob";
    private static final String TOP_TRIPS_TRIGGER = "topTripsTrigger";

    @Bean
    public JobDetail topTripsPrintJobDetail() {
        return JobBuilder.newJob(TopThreeTripsJob.class).withIdentity(TOP_TRIPS_JOB_IDENTITY)
                .storeDurably().build();
    }

    @Bean
    public SimpleTrigger topTripsPrintTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInSeconds(5).repeatForever();

        return TriggerBuilder.newTrigger().forJob(topTripsPrintJobDetail())
                .withIdentity(TOP_TRIPS_TRIGGER).withSchedule(scheduleBuilder).build();
    }

}
