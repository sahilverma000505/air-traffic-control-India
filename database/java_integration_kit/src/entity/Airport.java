package entity;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Entity representing an Indian Airport (Graph Vertex in Prim's Algorithm).
 * Maps to 'airports' table in MySQL / SQLite.
 */
@Entity
@Table(name = "airports")
public class Airport implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", nullable = false, unique = true, length = 10)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "elevation_ft")
    private Integer elevationFt;

    @Column(name = "runways")
    private Integer runways;

    @Column(name = "radar_type", length = 50)
    private String radarType;

    public Airport() {
    }

    public Airport(String code, String name, String city, String state, Double latitude, Double longitude) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.state = state;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getElevationFt() { return elevationFt; }
    public void setElevationFt(Integer elevationFt) { this.elevationFt = elevationFt; }

    public Integer getRunways() { return runways; }
    public void setRunways(Integer runways) { this.runways = runways; }

    public String getRadarType() { return radarType; }
    public void setRadarType(String radarType) { this.radarType = radarType; }

    @Override
    public String toString() {
        return "Airport[" + code + " - " + name + " (" + city + ")]";
    }
}
