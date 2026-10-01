package com.transport.predictor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "occupancy_percentage", nullable = false)
    private Double occupancyPercentage;

    @Column(name = "crowd_level", nullable = false)
    private String crowdLevel; // LOW, MEDIUM, HIGH, OVERCROWDED

    @Column(name = "report_score")
    private Double reportScore;

    @Column(name = "explanation", length = 1000)
    private String explanation;

    @Column(name = "prediction_time", nullable = false)
    private LocalDateTime predictionTime = LocalDateTime.now();

    public Prediction() {
    }

    public Prediction(Bus bus, Double occupancyPercentage, String crowdLevel, Double reportScore, String explanation) {
        this.bus = bus;
        this.occupancyPercentage = occupancyPercentage;
        this.crowdLevel = crowdLevel;
        this.reportScore = reportScore;
        this.explanation = explanation;
        this.predictionTime = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
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

    public Double getReportScore() {
        return reportScore;
    }

    public void setReportScore(Double reportScore) {
        this.reportScore = reportScore;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public LocalDateTime getPredictionTime() {
        return predictionTime;
    }

    public void setPredictionTime(LocalDateTime predictionTime) {
        this.predictionTime = predictionTime;
    }
}
