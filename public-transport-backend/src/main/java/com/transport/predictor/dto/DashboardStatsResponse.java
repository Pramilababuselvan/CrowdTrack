package com.transport.predictor.dto;

import java.util.List;

public class DashboardStatsResponse {

    private long totalBuses;
    private long lowCrowd;
    private long mediumCrowd;
    private long highCrowd;
    private long overcrowded;
    private long totalReports;
    private long totalPredictions;
    private List<PredictionResponse> recentPredictions;
    private List<BusResponse> topCrowdedBuses;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalBuses, long lowCrowd, long mediumCrowd, long highCrowd,
                                  long overcrowded, long totalReports, long totalPredictions,
                                  List<PredictionResponse> recentPredictions, List<BusResponse> topCrowdedBuses) {
        this.totalBuses = totalBuses;
        this.lowCrowd = lowCrowd;
        this.mediumCrowd = mediumCrowd;
        this.highCrowd = highCrowd;
        this.overcrowded = overcrowded;
        this.totalReports = totalReports;
        this.totalPredictions = totalPredictions;
        this.recentPredictions = recentPredictions;
        this.topCrowdedBuses = topCrowdedBuses;
    }

    public long getTotalBuses() {
        return totalBuses;
    }

    public void setTotalBuses(long totalBuses) {
        this.totalBuses = totalBuses;
    }

    public long getLowCrowd() {
        return lowCrowd;
    }

    public void setLowCrowd(long lowCrowd) {
        this.lowCrowd = lowCrowd;
    }

    public long getMediumCrowd() {
        return mediumCrowd;
    }

    public void setMediumCrowd(long mediumCrowd) {
        this.mediumCrowd = mediumCrowd;
    }

    public long getHighCrowd() {
        return highCrowd;
    }

    public void setHighCrowd(long highCrowd) {
        this.highCrowd = highCrowd;
    }

    public long getOvercrowded() {
        return overcrowded;
    }

    public void setOvercrowded(long overcrowded) {
        this.overcrowded = overcrowded;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getTotalPredictions() {
        return totalPredictions;
    }

    public void setTotalPredictions(long totalPredictions) {
        this.totalPredictions = totalPredictions;
    }

    public List<PredictionResponse> getRecentPredictions() {
        return recentPredictions;
    }

    public void setRecentPredictions(List<PredictionResponse> recentPredictions) {
        this.recentPredictions = recentPredictions;
    }

    public List<BusResponse> getTopCrowdedBuses() {
        return topCrowdedBuses;
    }

    public void setTopCrowdedBuses(List<BusResponse> topCrowdedBuses) {
        this.topCrowdedBuses = topCrowdedBuses;
    }
}
