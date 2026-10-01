package com.transport.predictor.service;

import com.transport.predictor.dto.BusRequest;
import com.transport.predictor.dto.BusResponse;
import com.transport.predictor.dto.PredictionResponse;
import com.transport.predictor.model.Bus;
import com.transport.predictor.repository.BusRepository;
import com.transport.predictor.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final ReportRepository reportRepository;
    private final PredictionService predictionService;

    @Autowired
    public BusService(BusRepository busRepository,
                      ReportRepository reportRepository,
                      PredictionService predictionService) {
        this.busRepository = busRepository;
        this.reportRepository = reportRepository;
        this.predictionService = predictionService;
    }

    public List<BusResponse> getAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapToBusResponse)
                .collect(Collectors.toList());
    }

    public Bus getBusEntityById(Long id) {
        return busRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bus not found with id: " + id));
    }

    public BusResponse getBusById(Long id) {
        Bus bus = getBusEntityById(id);
        return mapToBusResponse(bus);
    }

    @Transactional
    public BusResponse createBus(BusRequest request) {
        if (busRepository.findByBusNumber(request.getBusNumber()).isPresent()) {
            throw new IllegalArgumentException("Bus with number '" + request.getBusNumber() + "' already exists");
        }

        Bus bus = new Bus(
                request.getBusNumber().trim(),
                request.getRoute().trim(),
                request.getCapacity(),
                request.getCurrentPassengers(),
                request.getPeakHour()
        );
        Bus saved = busRepository.save(bus);

        // Compute initial prediction and persist history
        predictionService.predictCrowdForBus(saved.getId(), true);

        return mapToBusResponse(saved);
    }

    @Transactional
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = getBusEntityById(id);

        // Check if bus number is taken by another bus
        busRepository.findByBusNumber(request.getBusNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Bus number '" + request.getBusNumber() + "' is already in use");
            }
        });

        bus.setBusNumber(request.getBusNumber().trim());
        bus.setRoute(request.getRoute().trim());
        bus.setCapacity(request.getCapacity());
        bus.setCurrentPassengers(request.getCurrentPassengers());
        bus.setPeakHour(request.getPeakHour() != null ? request.getPeakHour() : false);

        Bus updated = busRepository.save(bus);

        // Recompute prediction
        predictionService.predictCrowdForBus(updated.getId(), true);

        return mapToBusResponse(updated);
    }

    @Transactional
    public BusResponse updatePassengerCount(Long id, int passengers, Boolean peakHour) {
        Bus bus = getBusEntityById(id);
        bus.setCurrentPassengers(Math.max(0, passengers));
        if (peakHour != null) {
            bus.setPeakHour(peakHour);
        }
        Bus updated = busRepository.save(bus);
        predictionService.predictCrowdForBus(updated.getId(), true);
        return mapToBusResponse(updated);
    }

    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new IllegalArgumentException("Bus not found with id: " + id);
        }
        busRepository.deleteById(id);
    }

    public List<BusResponse> searchBuses(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllBuses();
        }
        return busRepository.findByRouteContainingIgnoreCase(query.trim()).stream()
                .map(this::mapToBusResponse)
                .collect(Collectors.toList());
    }

    public BusResponse mapToBusResponse(Bus bus) {
        // Evaluate dynamic prediction
        PredictionResponse prediction = predictionService.predictCrowdForBus(bus.getId(), false);
        int reportCount = reportRepository.findByBusIdOrderByReportedAtDesc(bus.getId()).size();

        return new BusResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getRoute(),
                bus.getCapacity(),
                bus.getCurrentPassengers(),
                bus.getPeakHour(),
                prediction.getOccupancyPercentage(),
                prediction.getCrowdLevel(),
                prediction.getAdvice(),
                reportCount,
                bus.getCreatedAt()
        );
    }
}
