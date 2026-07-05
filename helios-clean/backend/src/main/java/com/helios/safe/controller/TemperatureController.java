package com.helios.safe.controller;
import com.helios.safe.model.EmergencyAlert;
import com.helios.safe.model.TemperatureReading;
import com.helios.safe.service.HeatSafetyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TemperatureController {
    @Autowired private HeatSafetyService heatSafetyService;

    @PostMapping("/analyze-temperature")
    public ResponseEntity<Map<String, Object>> analyzeTemperature(@RequestBody Map<String, Object> request) {
        double temperature = ((Number) request.get("temperature")).doubleValue();
        double humidity = ((Number) request.get("humidity")).doubleValue();
        String location = (String) request.getOrDefault("location", "Current Location");
        return ResponseEntity.ok(heatSafetyService.analyzeTemperature(temperature, humidity, location));
    }

    @PostMapping("/emergency-check")
    public ResponseEntity<Map<String, Object>> checkEmergency(@RequestBody Map<String, Object> request) {
        String destination = (String) request.get("destination");
        String reason = (String) request.get("reason");
        double temperature = ((Number) request.get("temperature")).doubleValue();
        double humidity = ((Number) request.get("humidity")).doubleValue();
        return ResponseEntity.ok(heatSafetyService.checkEmergencyTrip(destination, reason, temperature, humidity));
    }

    @GetMapping("/recent-readings")
    public ResponseEntity<List<TemperatureReading>> getRecentReadings() {
        return ResponseEntity.ok(heatSafetyService.getRecentReadings());
    }

    @GetMapping("/active-alerts")
    public ResponseEntity<List<EmergencyAlert>> getActiveAlerts() {
        return ResponseEntity.ok(heatSafetyService.getActiveAlerts());
    }

    @GetMapping("/recent-alerts")
    public ResponseEntity<List<EmergencyAlert>> getRecentAlerts() {
        return ResponseEntity.ok(heatSafetyService.getRecentAlerts());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "app", "Helios Safe"));
    }
}
