package com.transport.predictor.controller;

import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.model.Prediction;
import com.transport.predictor.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;

    @Autowired
    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<List<Prediction>> getAllPredictions() {
        return ResponseEntity.ok(predictionService.getAllPredictions());
    }

    @GetMapping("/bus/{busId}")
    public ResponseEntity<List<Prediction>> getPredictionsByBusId(@PathVariable Long busId) {
        return ResponseEntity.ok(predictionService.getPredictionsByBusId(busId));
    }

    @PostMapping("/{busId}")
    public ResponseEntity<?> generateAndSavePrediction(@PathVariable Long busId) {
        try {
            PredictionResponse response = predictionService.predictCrowdForBus(busId, true);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/live/{busId}")
    public ResponseEntity<?> getLivePrediction(@PathVariable Long busId) {
        try {
            PredictionResponse response = predictionService.predictCrowdForBus(busId, false);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
