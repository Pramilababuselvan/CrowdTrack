package com.transport.predictor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusRequest {

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "Route is required")
    private String route;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotNull(message = "Current passengers is required")
    @Min(value = 0, message = "Current passengers cannot be negative")
    private Integer currentPassengers;

    private Boolean peakHour = false;

    public BusRequest() {
    }

    public BusRequest(String busNumber, String route, Integer capacity, Integer currentPassengers, Boolean peakHour) {
        this.busNumber = busNumber;
        this.route = route;
        this.capacity = capacity;
        this.currentPassengers = currentPassengers;
        this.peakHour = peakHour != null ? peakHour : false;
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
}
