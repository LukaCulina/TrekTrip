package com.trektrip.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name ="comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserInfo user;

    @ManyToOne
    @JoinColumn(name="trip_id", referencedColumnName = "id")
    @JsonIgnore
    private Trip trip;

    private String content;

    private LocalDateTime time_of_posting;

    public Comment(Long id,  String content) {
        this.id = id;
        this.content = content;
    }
}
