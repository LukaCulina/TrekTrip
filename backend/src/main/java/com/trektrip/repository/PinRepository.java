package com.trektrip.repository;

import com.trektrip.model.Pin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface PinRepository extends JpaRepository<Pin, Long> {
}
