package com.transport.predictor.controller;

import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.dto.ReportRequest;
import com.transport.predictor.model.UserReport;
import com.transport.predictor.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<UserReport>> getAllReports() {
        return ResponseEntity.ok(reportService.getRecentReports());
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<UserReport>> getReportsForBus(@PathVariable Long busId) {
        return ResponseEntity.ok(reportService.getReportsForBus(busId));
    }

    @PostMapping
    public ResponseEntity<?> submitReport(@Valid @RequestBody ReportRequest request) {
        try {
            PredictionResponse updatedPrediction = reportService.submitReport(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedPrediction);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
