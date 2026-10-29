package entity;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Entity representing an active flight schedule tracked in the ATC radar system.
 * Maps to 'flight_schedules' table.
 */
@Entity
@Table(name = "flight_schedules")
public class FlightSchedule implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "flight_num", nullable = false, unique = true, length = 20)
    private String flightNum;

    @Column(name = "airline", nullable = false, length = 100)
    private String airline;

    @Column(name = "source_code", nullable = false, length = 10)
    private String sourceCode;

    @Column(name = "dest_code", nullable = false, length = 10)
    private String destCode;

    @Column(name = "departure_time", length = 20)
    private String departureTime;

    @Column(name = "arrival_time", length = 20)
    private String arrivalTime;

    @Column(name = "aircraft", length = 50)
    private String aircraft;

    @Column(name = "altitude_fl")
    private Integer altitudeFl;

    @Column(name = "speed_knots")
    private Integer speedKnots;

    @Column(name = "status", length = 50)
    private String status;

    public FlightSchedule() {
    }

    public FlightSchedule(String flightNum, String airline, String sourceCode, String destCode, String departureTime) {
        this.flightNum = flightNum;
        this.airline = airline;
        this.sourceCode = sourceCode;
        this.destCode = destCode;
        this.departureTime = departureTime;
        this.status = "SCHEDULED";
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getFlightNum() { return flightNum; }
    public void setFlightNum(String flightNum) { this.flightNum = flightNum; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getDestCode() { return destCode; }
    public void setDestCode(String destCode) { this.destCode = destCode; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getAircraft() { return aircraft; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }

    public Integer getAltitudeFl() { return altitudeFl; }
    public void setAltitudeFl(Integer altitudeFl) { this.altitudeFl = altitudeFl; }

    public Integer getSpeedKnots() { return speedKnots; }
    public void setSpeedKnots(Integer speedKnots) { this.speedKnots = speedKnots; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "Flight[" + flightNum + " (" + airline + "): " + sourceCode + " -> " + destCode + ", Status=" + status + "]";
    }
}
