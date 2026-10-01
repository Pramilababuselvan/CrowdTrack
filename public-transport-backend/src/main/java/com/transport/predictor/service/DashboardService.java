package com.transport.predictor.service;

import com.transport.predictor.dto.BusResponse;
import com.transport.predictor.dto.DashboardStatsResponse;
import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.model.Prediction;
import com.transport.predictor.repository.BusRepository;
import com.transport.predictor.repository.PredictionRepository;
import com.transport.predictor.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final BusRepository busRepository;
    private final ReportRepository reportRepository;
    private final PredictionRepository predictionRepository;
    private final BusService busService;

    @Autowired
    public DashboardService(BusRepository busRepository,
                            ReportRepository reportRepository,
                            PredictionRepository predictionRepository,
                            BusService busService) {
        this.busRepository = busRepository;
        this.reportRepository = reportRepository;
        this.predictionRepository = predictionRepository;
        this.busService = busService;
    }

    public DashboardStatsResponse getDashboardStats() {
        List<BusResponse> allBuses = busService.getAllBuses();

        long totalBuses = allBuses.size();
        long low = allBuses.stream().filter(b -> "LOW".equalsIgnoreCase(b.getCrowdLevel())).count();
        long medium = allBuses.stream().filter(b -> "MEDIUM".equalsIgnoreCase(b.getCrowdLevel())).count();
        long high = allBuses.stream().filter(b -> "HIGH".equalsIgnoreCase(b.getCrowdLevel())).count();
        long overcrowded = allBuses.stream().filter(b -> "OVERCROWDED".equalsIgnoreCase(b.getCrowdLevel())).count();

        long totalReports = reportRepository.count();
        long totalPredictions = predictionRepository.count();

        List<Prediction> recentPredictionEntities = predictionRepository.findTop20ByOrderByPredictionTimeDesc();
        List<PredictionResponse> recentPredictions = recentPredictionEntities.stream()
                .map(p -> new PredictionResponse(
                        p.getBus().getId(),
                        p.getBus().getBusNumber(),
                        p.getBus().getRoute(),
                        p.getBus().getCapacity(),
                        p.getBus().getCurrentPassengers(),
                        p.getOccupancyPercentage(),
                        p.getBus().getPeakHour(),
                        p.getCrowdLevel(),
                        p.getReportScore(),
                        0,
                        "",
                        p.getExplanation(),
                        p.getPredictionTime()
                ))
                .limit(6)
                .collect(Collectors.toList());

        List<BusResponse> topCrowded = allBuses.stream()
                .sorted((b1, b2) -> Double.compare(b2.getOccupancyPercentage(), b1.getOccupancyPercentage()))
                .limit(5)
                .collect(Collectors.toList());

        return new DashboardStatsResponse(
                totalBuses,
                low,
                medium,
                high,
                overcrowded,
                totalReports,
                totalPredictions,
                recentPredictions,
                topCrowded
        );
    }
}
