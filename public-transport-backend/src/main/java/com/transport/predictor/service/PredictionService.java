package com.transport.predictor.service;

import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.model.Bus;
import com.transport.predictor.model.Prediction;
import com.transport.predictor.model.UserReport;
import com.transport.predictor.repository.BusRepository;
import com.transport.predictor.repository.PredictionRepository;
import com.transport.predictor.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PredictionService {

    private final BusRepository busRepository;
    private final ReportRepository reportRepository;
    private final PredictionRepository predictionRepository;

    @Autowired
    public PredictionService(BusRepository busRepository,
                             ReportRepository reportRepository,
                             PredictionRepository predictionRepository) {
        this.busRepository = busRepository;
        this.reportRepository = reportRepository;
        this.predictionRepository = predictionRepository;
    }

    /**
     * Rule-Based Prediction Engine
     * Evaluates:
     * 1. Direct Occupancy % (passengers / capacity)
     * 2. Peak Hour condition modifier
     * 3. Aggregated User Reports (weighted scoring: LOW=0, MEDIUM=1, HIGH=2, OVERCROWDED=3)
     */
    @Transactional
    public PredictionResponse predictCrowdForBus(Long busId, boolean persistPrediction) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with ID: " + busId));

        int capacity = bus.getCapacity() > 0 ? bus.getCapacity() : 1;
        int passengers = bus.getCurrentPassengers() != null ? bus.getCurrentPassengers() : 0;
        boolean isPeak = Boolean.TRUE.equals(bus.getPeakHour());

        // 1. Calculate raw occupancy percentage
        double rawOccupancy = ((double) passengers / capacity) * 100.0;
        double roundedOccupancy = Math.round(rawOccupancy * 10.0) / 10.0;

        // 2. Base Rule Classification
        String baseCrowdLevel;
        if (roundedOccupancy > 100.0) {
            baseCrowdLevel = "OVERCROWDED";
        } else if (roundedOccupancy >= 80.0) {
            baseCrowdLevel = "HIGH";
        } else if (roundedOccupancy >= 50.0) {
            baseCrowdLevel = "MEDIUM";
        } else {
            baseCrowdLevel = "LOW";
        }

        // 3. User Reports Scoring
        List<UserReport> recentReports = reportRepository.findByBusIdOrderByReportedAtDesc(busId);
        // Take up to latest 5 reports for active context
        List<UserReport> activeReports = recentReports.stream().limit(5).toList();

        double totalReportPoints = 0.0;
        for (UserReport r : activeReports) {
            totalReportPoints += getPointsForLevel(r.getCrowdLevel());
        }

        double avgReportScore = 0.0;
        if (!activeReports.isEmpty()) {
            avgReportScore = Math.round((totalReportPoints / activeReports.size()) * 100.0) / 100.0;
        }

        // 4. Decision Rule Logic
        String finalCrowdLevel = baseCrowdLevel;
        StringBuilder notes = new StringBuilder();
        notes.append(String.format("Base Occupancy: %d/%d (%.1f%%) => %s. ",
                passengers, capacity, roundedOccupancy, baseCrowdLevel));

        if (isPeak) {
            notes.append("Peak Hour: Active. ");
            // In peak hour, borderline values get pushed higher
            if (baseCrowdLevel.equals("LOW") && roundedOccupancy >= 40.0) {
                finalCrowdLevel = "MEDIUM";
                notes.append("Shifted LOW -> MEDIUM due to peak hour surge. ");
            } else if (baseCrowdLevel.equals("MEDIUM") && roundedOccupancy >= 70.0) {
                finalCrowdLevel = "HIGH";
                notes.append("Shifted MEDIUM -> HIGH due to peak hour surge. ");
            }
        } else {
            notes.append("Peak Hour: Inactive. ");
        }

        if (!activeReports.isEmpty()) {
            notes.append(String.format("Recent User Reports: %d (Avg Score: %.2f/3.00). ",
                    activeReports.size(), avgReportScore));

            // Escalation / de-escalation based on user community reports
            if (avgReportScore >= 2.2 && (finalCrowdLevel.equals("LOW") || finalCrowdLevel.equals("MEDIUM"))) {
                finalCrowdLevel = "HIGH";
                notes.append("Elevated to HIGH based on severe user reports. ");
            } else if (avgReportScore >= 2.7) {
                finalCrowdLevel = "OVERCROWDED";
                notes.append("Elevated to OVERCROWDED based on unanimous crowd alerts. ");
            } else if (avgReportScore <= 0.4 && finalCrowdLevel.equals("MEDIUM") && roundedOccupancy < 60.0) {
                finalCrowdLevel = "LOW";
                notes.append("Lowered to LOW based on favorable user reports. ");
            }
        } else {
            notes.append("No recent user reports. ");
        }

        // Generate Passenger Guidance Advice
        String advice = getTravelAdvice(finalCrowdLevel, roundedOccupancy, isPeak);

        // 5. Persist Prediction history if requested
        if (persistPrediction) {
            Prediction prediction = new Prediction(bus, roundedOccupancy, finalCrowdLevel, avgReportScore, notes.toString());
            predictionRepository.save(prediction);
        }

        return new PredictionResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getRoute(),
                bus.getCapacity(),
                bus.getCurrentPassengers(),
                roundedOccupancy,
                isPeak,
                finalCrowdLevel,
                avgReportScore,
                activeReports.size(),
                advice,
                notes.toString(),
                LocalDateTime.now()
        );
    }

    public List<Prediction> getAllPredictions() {
        return predictionRepository.findTop20ByOrderByPredictionTimeDesc();
    }

    public List<Prediction> getPredictionsByBusId(Long busId) {
        return predictionRepository.findByBusIdOrderByPredictionTimeDesc(busId);
    }

    private double getPointsForLevel(String level) {
        if (level == null) return 0.0;
        return switch (level.toUpperCase()) {
            case "OVERCROWDED" -> 3.0;
            case "HIGH" -> 2.0;
            case "MEDIUM" -> 1.0;
            default -> 0.0; // LOW
        };
    }

    private String getTravelAdvice(String crowdLevel, double occupancy, boolean isPeak) {
        return switch (crowdLevel) {
            case "OVERCROWDED" -> "Hazardous crowding! Please wait for the next scheduled bus.";
            case "HIGH" -> "Heavy congestion expected. Consider traveling 15-20 minutes later.";
            case "MEDIUM" -> isPeak
                    ? "Seats are filling up fast due to peak hour. Board promptly."
                    : "Moderate crowd. Plenty of standing room and several seats open.";
            default -> "Low crowd. Excellent time to travel with comfortable seating!";
        };
    }
}
