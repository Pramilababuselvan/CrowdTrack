package com.transport.predictor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(name = "route", nullable = false)
    private String route;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "current_passengers", nullable = false)
    private Integer currentPassengers;

    @Column(name = "peak_hour", nullable = false)
    private Boolean peakHour = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<UserReport> reports = new ArrayList<>();

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Prediction> predictions = new ArrayList<>();

    public Bus() {
    }

    public Bus(String busNumber, String route, Integer capacity, Integer currentPassengers, Boolean peakHour) {
        this.busNumber = busNumber;
        this.route = route;
        this.capacity = capacity;
        this.currentPassengers = currentPassengers;
        this.peakHour = peakHour != null ? peakHour : false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getCurrentPassengers() {
        return currentPassengers;
    }

    public void setCurrentPassengers(Integer currentPassengers) {
        this.currentPassengers = currentPassengers;
    }

    public Boolean getPeakHour() {
        return peakHour;
    }

    public void setPeakHour(Boolean peakHour) {
        this.peakHour = peakHour;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<UserReport> getReports() {
        return reports;
    }

    public void setReports(List<UserReport> reports) {
        this.reports = reports;
    }

    public List<Prediction> getPredictions() {
        return predictions;
    }

    public void setPredictions(List<Prediction> predictions) {
        this.predictions = predictions;
    }

    public double getOccupancyPercentage() {
        if (capacity == null || capacity == 0) return 0.0;
        double current = currentPassengers != null ? currentPassengers : 0;
        return Math.round(((current / capacity) * 100.0) * 10.0) / 10.0;
    }
}
