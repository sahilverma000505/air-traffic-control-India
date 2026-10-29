"""
Database Manager for Air Traffic Control of India (DAA Mini Project)
Uses Python's built-in sqlite3 module - zero external dependencies required.
Easily portable to MySQL, PostgreSQL, JDBC, and Hibernate.
"""

import sqlite3
import os
import time

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'airtraffic.db')
SCHEMA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'schema.sql')
SEED_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'seed_data.sql')

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database(force=False):
    """Initializes the database using schema.sql and seed_data.sql if not existing or if forced."""
    if not force and os.path.exists(DB_PATH):
        try:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) as count FROM airports")
            count = cur.fetchone()['count']
            # Verify capacity_per_hour column exists
            cur.execute("PRAGMA table_info(airports)")
            cols = [r['name'] for r in cur.fetchall()]
            conn.close()
            if count > 0 and 'capacity_per_hour' in cols:
                return False  # Already initialized
        except Exception:
            pass

    conn = get_connection()
    cur = conn.cursor()

    # Drop existing tables if recreating
    cur.executescript("""
        DROP TABLE IF EXISTS mst_runs;
        DROP TABLE IF EXISTS flight_schedules;
        DROP TABLE IF EXISTS airway_routes;
        DROP TABLE IF EXISTS airports;
    """)

    # Read and execute schema
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        cur.executescript(f.read())

    # Read and execute seed data
    with open(SEED_PATH, 'r', encoding='utf-8') as f:
        cur.executescript(f.read())

    conn.commit()
    conn.close()
    return True

def get_all_airports():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM airports ORDER BY code ASC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def get_all_routes():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM airway_routes ORDER BY id ASC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def get_all_flights():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM flight_schedules ORDER BY departure_time ASC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

def add_airport(code, name, city, state, lat, lon, elevation=0, runways=1, capacity=40, load_pct=60, radar_type='MSSR'):
    conn = get_connection()
    cur = conn.cursor()
    code = code.strip().upper()
    cur.execute("""
        INSERT INTO airports (code, name, city, state, latitude, longitude, elevation_ft, runways, capacity_per_hour, current_load_pct, radar_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (code, name, city, state, float(lat), float(lon), int(elevation), int(runways), int(capacity), int(load_pct), radar_type))
    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    return new_id

def add_route(source_code, dest_code, distance_km, corridor_code='CUSTOM-CORRIDOR', frequency=122.500):
    conn = get_connection()
    cur = conn.cursor()
    src = source_code.strip().upper()
    dst = dest_code.strip().upper()
    cur.execute("""
        INSERT INTO airway_routes (source_code, dest_code, distance_km, corridor_code, frequency_mhz)
        VALUES (?, ?, ?, ?, ?)
    """, (src, dst, int(distance_km), corridor_code, float(frequency)))
    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    return new_id

def update_hazard(route_id, hazard_text, is_active=1):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE airway_routes
        SET weather_hazard = ?, is_active = ?
        WHERE id = ?
    """, (hazard_text, int(is_active), int(route_id)))
    conn.commit()
    conn.close()
    return True

def log_mst_run(start_hub, total_mst, original_mesh, savings_pct, edges_count, exec_time_ms, delays_saved=0, fuel_saved=0, co2_saved=0.0):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO mst_runs (start_hub, total_mst_distance_km, original_mesh_distance_km, savings_pct, edges_count, execution_time_ms, delays_saved_minutes, fuel_saved_liters, co2_saved_tons)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (start_hub, int(total_mst), int(original_mesh), float(savings_pct), int(edges_count), float(exec_time_ms), int(delays_saved), int(fuel_saved), float(co2_saved)))
    new_id = cur.lastrowid
    conn.commit()
    conn.close()
    return new_id

def get_mst_history():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM mst_runs ORDER BY run_timestamp DESC LIMIT 20")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows

if __name__ == '__main__':
    print("Re-initializing Database with capacity & performance metrics...")
    init_database(force=True)
    print(f"Database ready at: {DB_PATH}")
    print(f"Airports: {len(get_all_airports())}, Routes: {len(get_all_routes())}, Flights: {len(get_all_flights())}")
