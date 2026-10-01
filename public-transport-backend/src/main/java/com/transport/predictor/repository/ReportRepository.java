package com.transport.predictor.repository;

import com.transport.predictor.model.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<UserReport, Long> {
    List<UserReport> findByBusIdOrderByReportedAtDesc(Long busId);
    List<UserReport> findTop20ByOrderByReportedAtDesc();
    List<UserReport> findByBusIdAndReportedAtAfter(Long busId, LocalDateTime after);
    long countByCrowdLevel(String crowdLevel);
}
