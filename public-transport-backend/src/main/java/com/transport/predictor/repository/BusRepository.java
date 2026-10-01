package com.transport.predictor.repository;

import com.transport.predictor.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    Optional<Bus> findByBusNumber(String busNumber);
    List<Bus> findByRouteContainingIgnoreCase(String route);
    List<Bus> findByPeakHour(Boolean peakHour);
}
