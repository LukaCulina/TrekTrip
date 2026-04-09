package com.trektrip.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id", referencedColumnName = "id")
    @JsonBackReference
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserInfo user;

    @Column(name = "rating", columnDefinition = "DOUBLE")
    private double rating;

    public Rating(Long id, double rating) {
        this.id = id;
        this.rating = rating;
    }

    public int compareTo(Rating rating2) {
        return Double.compare(getRating(), rating2.getRating());
    }
}
