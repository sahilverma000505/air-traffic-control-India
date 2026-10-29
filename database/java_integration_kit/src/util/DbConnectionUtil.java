package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Pure JDBC Connection Utility.
 * Provides connections for plain JDBC DAOs to either SQLite or MySQL.
 */
public class DbConnectionUtil {

    // Default: Points to the project's SQLite database
    private static final String SQLITE_URL = "jdbc:sqlite:../../database/airtraffic.db";

    // Uncomment and configure if your lab uses MySQL / XAMPP:
    // private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/airtraffic?useSSL=false&serverTimezone=UTC";
    // private static final String USER = "root";
    // private static final String PASS = "";

    public static Connection getConnection() throws SQLException {
        try {
            // Load SQLite JDBC Driver class
            Class.forName("org.sqlite.JDBC");
            return DriverManager.getConnection(SQLITE_URL);
        } catch (ClassNotFoundException e) {
            throw new SQLException("SQLite Driver not found. Ensure sqlite-jdbc is in your classpath.", e);
        }
    }

    /*
    // MySQL Helper (if needed):
    public static Connection getMySqlConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(MYSQL_URL, USER, PASS);
    }
    */
}
