package dao;

import entity.Airport;
import entity.AirwayRoute;
import util.DbConnectionUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Pure JDBC Data Access Object (DAO).
 * Demonstrates PreparedStatement, ResultSet, and SQL queries for DAA Graph processing.
 */
public class AirportJdbcDao {

    /**
     * Retrieve all Indian airports (Graph Vertices).
     */
    public List<Airport> getAllAirports() throws SQLException {
        List<Airport> list = new ArrayList<>();
        String sql = "SELECT * FROM airports ORDER BY code ASC";

        try (Connection conn = DbConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Airport a = new Airport();
                a.setId(rs.getInt("id"));
                a.setCode(rs.getString("code"));
                a.setName(rs.getString("name"));
                a.setCity(rs.getString("city"));
                a.setState(rs.getString("state"));
                a.setLatitude(rs.getDouble("latitude"));
                a.setLongitude(rs.getDouble("longitude"));
                a.setElevationFt(rs.getInt("elevation_ft"));
                a.setRunways(rs.getInt("runways"));
                a.setRadarType(rs.getString("radar_type"));
                list.add(a);
            }
        }
        return list;
    }

    /**
     * Retrieve all active airway corridors (Graph Edges with Weights in km).
     */
    public List<AirwayRoute> getAllActiveRoutes() throws SQLException {
        List<AirwayRoute> routes = new ArrayList<>();
        String sql = "SELECT * FROM airway_routes WHERE is_active = 1";

        try (Connection conn = DbConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                AirwayRoute r = new AirwayRoute();
                r.setId(rs.getInt("id"));
                r.setSourceCode(rs.getString("source_code"));
                r.setDestCode(rs.getString("dest_code"));
                r.setDistanceKm(rs.getInt("distance_km"));
                r.setCorridorCode(rs.getString("corridor_code"));
                r.setFrequencyMhz(rs.getDouble("frequency_mhz"));
                r.setIsActive(rs.getInt("is_active"));
                r.setWeatherHazard(rs.getString("weather_hazard"));
                routes.add(r);
            }
        }
        return routes;
    }

    /**
     * Insert a new airport into database.
     */
    public int insertAirport(Airport airport) throws SQLException {
        String sql = "INSERT INTO airports (code, name, city, state, latitude, longitude, elevation_ft, runways, radar_type) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DbConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, airport.getCode());
            ps.setString(2, airport.getName());
            ps.setString(3, airport.getCity());
            ps.setString(4, airport.getState());
            ps.setDouble(5, airport.getLatitude());
            ps.setDouble(6, airport.getLongitude());
            ps.setInt(7, airport.getElevationFt() != null ? airport.getElevationFt() : 0);
            ps.setInt(8, airport.getRunways() != null ? airport.getRunways() : 1);
            ps.setString(9, airport.getRadarType() != null ? airport.getRadarType() : "MSSR");

            ps.executeUpdate();
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                }
            }
        }
        return -1;
    }

    // Quick Main method for testing JDBC connectivity in Lab
    public static void main(String[] args) {
        AirportJdbcDao dao = new AirportJdbcDao();
        try {
            System.out.println("--- Testing Pure JDBC Connection ---");
            List<Airport> airports = dao.getAllAirports();
            System.out.println("Successfully loaded " + airports.size() + " airports via JDBC:");
            for (Airport a : airports) {
                System.out.println("  * " + a.getCode() + " -> " + a.getName() + " (" + a.getCity() + ")");
            }

            List<AirwayRoute> routes = dao.getAllActiveRoutes();
            System.out.println("\nLoaded " + routes.size() + " airway corridors (edges) with distances.");
        } catch (SQLException e) {
            System.err.println("JDBC Connection Failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
