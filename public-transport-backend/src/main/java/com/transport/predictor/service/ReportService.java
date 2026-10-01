package com.transport.predictor.service;

import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.dto.ReportRequest;
import com.transport.predictor.model.Bus;
import com.transport.predictor.model.UserReport;
import com.transport.predictor.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final BusService busService;
    private final PredictionService predictionService;

    @Autowired
    public ReportService(ReportRepository reportRepository,
                         BusService busService,
                         PredictionService predictionService) {
        this.reportRepository = reportRepository;
        this.busService = busService;
        this.predictionService = predictionService;
    }

    @Transactional
    public PredictionResponse submitReport(ReportRequest request) {
        Bus bus = busService.getBusEntityById(request.getBusId());

        UserReport report = new UserReport(
                bus,
                request.getCrowdLevel().toUpperCase(),
                request.getPassengerCount(),
                request.getComment(),
                request.getReporterName()
        );
        reportRepository.save(report);

        // Optionally update bus current passenger count if user reported a count
        if (request.getPassengerCount() != null && request.getPassengerCount() > 0) {
            bus.setCurrentPassengers(request.getPassengerCount());
        }

        // Trigger immediate rule-based crowd recalculation and log prediction history
        return predictionService.predictCrowdForBus(bus.getId(), true);
    }

    public List<UserReport> getReportsForBus(Long busId) {
        return reportRepository.findByBusIdOrderByReportedAtDesc(busId);
    }

    public List<UserReport> getRecentReports() {
        return reportRepository.findTop20ByOrderByReportedAtDesc();
    }
}
