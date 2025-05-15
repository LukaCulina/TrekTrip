package com.trektrip.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Type;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private UserInfo user;

    @OneToMany(targetEntity = Image.class)
    private List<Image> images;

    private int lengthInDays;

    private int price;

    private String tripMonth;

    @ManyToMany
    @JoinTable(name = "trips_locations",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "location_id"))
    private List<Location> locations;

    @OneToMany(mappedBy = "trip", fetch = FetchType.EAGER)
    @Fetch(FetchMode.SELECT)
    @JsonIgnore
    private List<Rating> ratings;

    @OneToMany(mappedBy = "trip", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Comment> comments;

    private boolean isPublic;

    public Trip(Long id, String title, String description, int lengthInDays, boolean isPublic) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lengthInDays = lengthInDays;
        this.isPublic = isPublic;
    }

    public Trip(Long id, String title, String description, int lengthInDays, boolean isPublic, List<Image> images) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.lengthInDays = lengthInDays;
        this.isPublic = isPublic;
        this.images = images;
    }

    @Override
    public String toString() {
        return "Trip: " + "id=" + id + ", " + title;
    }
}
