package com.transport.predictor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_reports")
public class UserReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "crowd_level", nullable = false)
    private String crowdLevel; // LOW, MEDIUM, HIGH, OVERCROWDED

    @Column(name = "passenger_count")
    private Integer passengerCount;

    @Column(name = "comment", length = 500)
    private String comment;

    @Column(name = "reporter_name")
    private String reporterName = "Anonymous Passenger";

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    public UserReport() {
    }

    public UserReport(Bus bus, String crowdLevel, Integer passengerCount, String comment, String reporterName) {
        this.bus = bus;
        this.crowdLevel = crowdLevel;
        this.passengerCount = passengerCount;
        this.comment = comment;
        this.reporterName = (reporterName != null && !reporterName.trim().isEmpty()) ? reporterName : "Passenger";
        this.reportedAt = LocalDateTime.now();
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

    public String getCrowdLevel() {
        return crowdLevel;
    }

    public void setCrowdLevel(String crowdLevel) {
        this.crowdLevel = crowdLevel;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }
}
