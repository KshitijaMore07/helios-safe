package com.helios.safe.service;
import com.helios.safe.model.EmergencyAlert;
import com.helios.safe.model.TemperatureReading;
import com.helios.safe.repository.EmergencyAlertRepository;
import com.helios.safe.repository.TemperatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class HeatSafetyService {
    @Autowired private TemperatureRepository temperatureRepository;
    @Autowired private EmergencyAlertRepository emergencyAlertRepository;

    public Map<String, Object> analyzeTemperature(double tempC, double humidity, String location) {
        double feelsLike = calculateHeatIndex(tempC, humidity);
        String dangerLevel = getDangerLevel(feelsLike);
        String heatIndex = getHeatIndexLabel(feelsLike);
        TemperatureReading reading = new TemperatureReading(tempC, feelsLike, humidity, heatIndex, dangerLevel, location);
        temperatureRepository.save(reading);
        Map<String, Object> response = new HashMap<>();
        response.put("temperature", tempC);
        response.put("feelsLike", Math.round(feelsLike * 10.0) / 10.0);
        response.put("humidity", humidity);
        response.put("heatIndex", heatIndex);
        response.put("dangerLevel", dangerLevel);
        response.put("location", location);
        response.put("canGoOut", !dangerLevel.equals("EXTREME_DANGER"));
        response.put("warningMessage", getWarningMessage(dangerLevel, feelsLike));
        response.put("precautions", getGeneralPrecautions(dangerLevel));
        return response;
    }

    public Map<String, Object> checkEmergencyTrip(String destination, String reason, double currentTemp, double humidity) {
        double feelsLike = calculateHeatIndex(currentTemp, humidity);
        String dangerLevel = getDangerLevel(feelsLike);
        List<String> precautions = getEmergencyPrecautions(destination, feelsLike);
        String urgencyLevel = getUrgencyLevel(reason);
        EmergencyAlert alert = new EmergencyAlert(destination, reason, urgencyLevel, currentTemp, precautions, "Main Road");
        emergencyAlertRepository.save(alert);
        Map<String, Object> response = new HashMap<>();
        response.put("canProceed", true);
        response.put("destination", destination);
        response.put("urgencyLevel", urgencyLevel);
        response.put("currentTemperature", currentTemp);
        response.put("feelsLike", Math.round(feelsLike * 10.0) / 10.0);
        response.put("dangerLevel", dangerLevel);
        response.put("precautions", precautions);
        response.put("estimatedRisk", getRiskLevel(dangerLevel));
        response.put("recommendedTimeWindow", getRecommendedTimeWindow());
        return response;
    }

    public List<TemperatureReading> getRecentReadings() { return temperatureRepository.findTop10ByOrderByTimestampDesc(); }
    public List<EmergencyAlert> getActiveAlerts() { return emergencyAlertRepository.findByActiveTrue(); }
    public List<EmergencyAlert> getRecentAlerts() { return emergencyAlertRepository.findTop5ByOrderByTimestampDesc(); }

    private double calculateHeatIndex(double tempC, double humidity) {
        double tempF = (tempC * 9.0 / 5.0) + 32;
        if (tempF < 80) return tempC;
        double hi = -42.379 + 2.04901523 * tempF + 10.14333127 * humidity
                - 0.22475541 * tempF * humidity - 0.00683783 * tempF * tempF
                - 0.05481717 * humidity * humidity + 0.00122874 * tempF * tempF * humidity
                + 0.00085282 * tempF * humidity * humidity
                - 0.00000199 * tempF * tempF * humidity * humidity;
        return (hi - 32) * 5.0 / 9.0;
    }

    private String getDangerLevel(double feelsLikeC) {
        if (feelsLikeC < 27) return "SAFE";
        if (feelsLikeC < 32) return "CAUTION";
        if (feelsLikeC < 41) return "EXTREME_CAUTION";
        if (feelsLikeC < 54) return "DANGER";
        return "EXTREME_DANGER";
    }

    private String getHeatIndexLabel(double f) {
        if (f < 27) return "Normal"; if (f < 32) return "Caution";
        if (f < 41) return "Extreme Caution"; if (f < 54) return "Danger";
        return "Extreme Danger";
    }

    private String getWarningMessage(String d, double f) {
        int t = (int) Math.round(f);
        switch (d) {
            case "SAFE": return "Safe to go outside!";
            case "CAUTION": return "Feels like " + t + "C. Use caution outdoors.";
            case "EXTREME_CAUTION": return "Feels like " + t + "C. Limit outdoor exposure.";
            case "DANGER": return "DANGER! Feels like " + t + "C. Avoid going outside.";
            default: return "EXTREME DANGER! Feels like " + t + "C. Stay indoors immediately!";
        }
    }

    private List<String> getGeneralPrecautions(String d) {
        List<String> p = new ArrayList<>();
        p.add("Drink at least 2-3 litres of water daily");
        p.add("Wear light-coloured loose-fitting clothes");
        if (!d.equals("SAFE")) { p.add("Avoid outdoor activity 12PM-4PM"); p.add("Use sunscreen SPF 30+"); p.add("Carry ORS packets"); }
        if (d.equals("DANGER") || d.equals("EXTREME_DANGER")) {
            p.add("STAY INDOORS - Avoid all outdoor activities");
            p.add("Keep cool with fans/AC and wet towels");
            p.add("Emergency number: 108 (Ambulance)");
        }
        return p;
    }

    private List<String> getEmergencyPrecautions(String destination, double feelsLike) {
        List<String> p = new ArrayList<>();
        p.add("Use air-conditioned transport whenever possible");
        p.add("Carry at least 1.5L of water per person");
        p.add("Apply sunscreen SPF 50+ before leaving");
        p.add("Wear light breathable cotton clothing and hat");
        p.add("Carry ice packs or a cold damp towel");
        p.add("Keep phone fully charged with emergency numbers saved");
        p.add("Plan the shortest possible route to " + destination);
        p.add("Note the nearest hospital on your route");
        p.add("Carry ORS (Oral Rehydration Salts) packets");
        if (feelsLike > 40) { p.add("CRITICAL: Take 5-min breaks in shade every 15 mins"); p.add("Inform someone of your route before leaving"); }
        return p;
    }

    private String getUrgencyLevel(String reason) {
        String r = reason.toLowerCase();
        if (r.contains("hospital") || r.contains("accident") || r.contains("emergency")) return "CRITICAL";
        if (r.contains("medicine") || r.contains("pharmacy") || r.contains("urgent")) return "HIGH";
        return "MODERATE";
    }

    private String getRiskLevel(String d) {
        switch (d) {
            case "SAFE": return "LOW"; case "CAUTION": return "MODERATE";
            case "EXTREME_CAUTION": return "HIGH"; case "DANGER": return "VERY HIGH";
            default: return "CRITICAL";
        }
    }

    private String getRecommendedTimeWindow() {
        int hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        if (hour < 8) return "Now is good - early morning cooler";
        if (hour < 11) return "Go now - temperature rising but manageable";
        if (hour < 16) return "Peak heat hours - go only if absolutely necessary";
        return "Evening is safer - temperature dropping";
    }
}
