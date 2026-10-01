package com.transport.predictor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReportRequest {

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotBlank(message = "Crowd level is required (LOW, MEDIUM, HIGH, OVERCROWDED)")
    private String crowdLevel;

    private Integer passengerCount;

    private String comment;

    private String reporterName;

    public ReportRequest() {
    }

    public ReportRequest(Long busId, String crowdLevel, Integer passengerCount, String comment, String reporterName) {
        this.busId = busId;
        this.crowdLevel = crowdLevel;
        this.passengerCount = passengerCount;
        this.comment = comment;
        this.reporterName = reporterName;
    }

    public Long getBusId() {
        return busId;
    }

    public void setBusId(Long busId) {
        this.busId = busId;
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
}
