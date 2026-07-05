package com.helios.safe.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "emergency_alerts")
public class EmergencyAlert {
    @Id
    private String id;
    private String destination;
    private String reason;
    private String urgencyLevel;
    private double currentTemperature;
    private List<String> precautions;
    private String recommendedRoute;
    private LocalDateTime timestamp;
    private boolean active;

    public EmergencyAlert() {}
    public EmergencyAlert(String destination, String reason, String urgencyLevel,
                           double currentTemperature, List<String> precautions, String recommendedRoute) {
        this.destination = destination; this.reason = reason; this.urgencyLevel = urgencyLevel;
        this.currentTemperature = currentTemperature; this.precautions = precautions;
        this.recommendedRoute = recommendedRoute; this.timestamp = LocalDateTime.now(); this.active = true;
    }
    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public String getDestination() { return destination; } public void setDestination(String d) { this.destination = d; }
    public String getReason() { return reason; } public void setReason(String r) { this.reason = r; }
    public String getUrgencyLevel() { return urgencyLevel; } public void setUrgencyLevel(String u) { this.urgencyLevel = u; }
    public double getCurrentTemperature() { return currentTemperature; } public void setCurrentTemperature(double t) { this.currentTemperature = t; }
    public List<String> getPrecautions() { return precautions; } public void setPrecautions(List<String> p) { this.precautions = p; }
    public String getRecommendedRoute() { return recommendedRoute; } public void setRecommendedRoute(String r) { this.recommendedRoute = r; }
    public LocalDateTime getTimestamp() { return timestamp; } public void setTimestamp(LocalDateTime t) { this.timestamp = t; }
    public boolean isActive() { return active; } public void setActive(boolean a) { this.active = a; }
}
