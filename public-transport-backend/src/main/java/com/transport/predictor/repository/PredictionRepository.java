package com.transport.predictor.repository;

import com.transport.predictor.model.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByBusIdOrderByPredictionTimeDesc(Long busId);
    Optional<Prediction> findFirstByBusIdOrderByPredictionTimeDesc(Long busId);
    List<Prediction> findTop20ByOrderByPredictionTimeDesc();
    long countByCrowdLevel(String crowdLevel);
}
