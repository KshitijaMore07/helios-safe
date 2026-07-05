package com.helios.safe.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "temperature_readings")
public class TemperatureReading {
    @Id
    private String id;
    private double temperature;
    private double feelsLike;
    private double humidity;
    private String heatIndex;
    private String dangerLevel;
    private String location;
    private LocalDateTime timestamp;

    public TemperatureReading() {}
    public TemperatureReading(double temperature, double feelsLike, double humidity,
                               String heatIndex, String dangerLevel, String location) {
        this.temperature = temperature; this.feelsLike = feelsLike; this.humidity = humidity;
        this.heatIndex = heatIndex; this.dangerLevel = dangerLevel; this.location = location;
        this.timestamp = LocalDateTime.now();
    }
    public String getId() { return id; } public void setId(String id) { this.id = id; }
    public double getTemperature() { return temperature; } public void setTemperature(double t) { this.temperature = t; }
    public double getFeelsLike() { return feelsLike; } public void setFeelsLike(double f) { this.feelsLike = f; }
    public double getHumidity() { return humidity; } public void setHumidity(double h) { this.humidity = h; }
    public String getHeatIndex() { return heatIndex; } public void setHeatIndex(String h) { this.heatIndex = h; }
    public String getDangerLevel() { return dangerLevel; } public void setDangerLevel(String d) { this.dangerLevel = d; }
    public String getLocation() { return location; } public void setLocation(String l) { this.location = l; }
    public LocalDateTime getTimestamp() { return timestamp; } public void setTimestamp(LocalDateTime t) { this.timestamp = t; }
}
