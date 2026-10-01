package com.transport.predictor.dto;

import java.time.LocalDateTime;

public class BusResponse {

    private Long id;
    private String busNumber;
    private String route;
    private Integer capacity;
    private Integer currentPassengers;
    private Boolean peakHour;
    private Double occupancyPercentage;
    private String crowdLevel;
    private String advice;
    private Integer reportCount;
    private LocalDateTime createdAt;

    public BusResponse() {
    }

    public BusResponse(Long id, String busNumber, String route, Integer capacity, Integer currentPassengers,
                       Boolean peakHour, Double occupancyPercentage, String crowdLevel, String advice,
                       Integer reportCount, LocalDateTime createdAt) {
        this.id = id;
        this.busNumber = busNumber;
        this.route = route;
        this.capacity = capacity;
        this.currentPassengers = currentPassengers;
        this.peakHour = peakHour;
        this.occupancyPercentage = occupancyPercentage;
        this.crowdLevel = crowdLevel;
        this.advice = advice;
        this.reportCount = reportCount;
        this.createdAt = createdAt;
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

    public Double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(Double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public Integer getReportCount() {
        return reportCount;
    }

    public void setReportCount(Integer reportCount) {
        this.reportCount = reportCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
