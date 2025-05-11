package com.trektrip.repository;

import com.trektrip.model.Image;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query(value = "INSERT INTO images (data) VALUES (?1) RETURNING url", nativeQuery = true)
    String saveImageData(byte[] imageData);
}

