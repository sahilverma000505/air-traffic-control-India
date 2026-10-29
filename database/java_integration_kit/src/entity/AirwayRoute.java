package entity;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Entity representing an Airway Flight Corridor (Graph Edge with Weight in Prim's Algorithm).
 * Maps to 'airway_routes' table.
 */
@Entity
@Table(name = "airway_routes")
public class AirwayRoute implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "source_code", nullable = false, length = 10)
    private String sourceCode;

    @Column(name = "dest_code", nullable = false, length = 10)
    private String destCode;

    @Column(name = "distance_km", nullable = false)
    private Integer distanceKm; // Edge weight

    @Column(name = "corridor_code", length = 30)
    private String corridorCode;

    @Column(name = "frequency_mhz")
    private Double frequencyMhz;

    @Column(name = "is_active")
    private Integer isActive;

    @Column(name = "weather_hazard", length = 100)
    private String weatherHazard;

    public AirwayRoute() {
    }

    public AirwayRoute(String sourceCode, String destCode, Integer distanceKm, String corridorCode) {
        this.sourceCode = sourceCode;
        this.destCode = destCode;
        this.distanceKm = distanceKm;
        this.corridorCode = corridorCode;
        this.isActive = 1;
        this.weatherHazard = "CLEAR";
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getDestCode() { return destCode; }
    public void setDestCode(String destCode) { this.destCode = destCode; }

    public Integer getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Integer distanceKm) { this.distanceKm = distanceKm; }

    public String getCorridorCode() { return corridorCode; }
    public void setCorridorCode(String corridorCode) { this.corridorCode = corridorCode; }

    public Double getFrequencyMhz() { return frequencyMhz; }
    public void setFrequencyMhz(Double frequencyMhz) { this.frequencyMhz = frequencyMhz; }

    public Integer getIsActive() { return isActive; }
    public void setIsActive(Integer isActive) { this.isActive = isActive; }

    public String getWeatherHazard() { return weatherHazard; }
    public void setWeatherHazard(String weatherHazard) { this.weatherHazard = weatherHazard; }

    @Override
    public String toString() {
        return "AirwayRoute[" + sourceCode + " <--> " + destCode + " : " + distanceKm + " km (" + corridorCode + ")]";
    }
}
