package com.transport.predictor.dto;

import java.time.LocalDateTime;

public class PredictionResponse {

    private Long busId;
    private String busNumber;
    private String route;
    private Integer capacity;
    private Integer currentPassengers;
    private Double occupancyPercentage;
    private Boolean peakHour;
    private String crowdLevel; // LOW, MEDIUM, HIGH, OVERCROWDED
    private Double userReportScore;
    private Integer recentReportsCount;
    private String advice;
    private String calculationDetails;
    private LocalDateTime predictionTime;

    public PredictionResponse() {
    }

    public PredictionResponse(Long busId, String busNumber, String route, Integer capacity, Integer currentPassengers,
                              Double occupancyPercentage, Boolean peakHour, String crowdLevel, Double userReportScore,
                              Integer recentReportsCount, String advice, String calculationDetails, LocalDateTime predictionTime) {
        this.busId = busId;
        this.busNumber = busNumber;
        this.route = route;
        this.capacity = capacity;
        this.currentPassengers = currentPassengers;
        this.occupancyPercentage = occupancyPercentage;
        this.peakHour = peakHour;
        this.crowdLevel = crowdLevel;
        this.userReportScore = userReportScore;
        this.recentReportsCount = recentReportsCount;
        this.advice = advice;
        this.calculationDetails = calculationDetails;
        this.predictionTime = predictionTime;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
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

    public Double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(Double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }

    public Boolean getPeakHour() {
        return peakHour;
    }

    public void setPeakHour(Boolean peakHour) {
        this.peakHour = peakHour;
    }

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }

    public Double getUserReportScore() {
        return userReportScore;
    }

    public void setUserReportScore(Double userReportScore) {
        this.userReportScore = userReportScore;
    }

    public Integer getRecentReportsCount() {
        return recentReportsCount;
    }

    public void setRecentReportsCount(Integer recentReportsCount) {
        this.recentReportsCount = recentReportsCount;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public String getCalculationDetails() {
        return calculationDetails;
    }

    public void setCalculationDetails(String calculationDetails) {
        this.calculationDetails = calculationDetails;
    }

    public LocalDateTime getPredictionTime() {
        return predictionTime;
    }

    public void setPredictionTime(LocalDateTime predictionTime) {
        this.predictionTime = predictionTime;
    }
}
