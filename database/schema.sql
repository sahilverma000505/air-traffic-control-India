-- ============================================================================
-- AIR TRAFFIC CONTROL OF INDIA - DATABASE SCHEMA
-- Compatible with SQLite, MySQL, PostgreSQL, JDBC & Hibernate
-- ============================================================================

-- Table 1: Indian Airports (Graph Vertices with Capacity & Sector Load)
CREATE TABLE IF NOT EXISTS airports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) NOT NULL UNIQUE,       -- IATA Code: e.g. DEL, BOM, BLR
    name VARCHAR(150) NOT NULL,             -- e.g. Indira Gandhi International Airport
    city VARCHAR(100) NOT NULL,             -- e.g. New Delhi
    state VARCHAR(100) NOT NULL,            -- e.g. Delhi NCR
    latitude DECIMAL(10, 6) NOT NULL,       -- e.g. 28.5562
    longitude DECIMAL(10, 6) NOT NULL,      -- e.g. 77.1000
    elevation_ft INTEGER DEFAULT 0,         -- Runway elevation in feet
    runways INTEGER DEFAULT 2,              -- Number of active runways
    capacity_per_hour INTEGER DEFAULT 50,   -- Maximum flight movements handled per hour
    current_load_pct INTEGER DEFAULT 65,    -- Current airspace sector congestion (0-100%)
    radar_type VARCHAR(50) DEFAULT 'PSR/SSR', -- Primary/Secondary Surveillance Radar
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Airway Corridors / Flight Routes (Graph Edges with Distance Weights)
CREATE TABLE IF NOT EXISTS airway_routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_code VARCHAR(10) NOT NULL,       -- From Airport
    dest_code VARCHAR(10) NOT NULL,         -- To Airport
    distance_km INTEGER NOT NULL,           -- Edge weight: Distance in kilometers
    corridor_code VARCHAR(30) DEFAULT 'Q-CORRIDOR', -- e.g. Q1, W10, P574
    frequency_mhz DECIMAL(6, 3) DEFAULT 121.500,    -- ATC VHF Communication Frequency
    is_active INTEGER DEFAULT 1,            -- 1: Open, 0: Closed / Rerouted
    weather_hazard VARCHAR(100) DEFAULT 'CLEAR',    -- CLEAR, THUNDERSTORM, FOG, TURBULENCE
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_code) REFERENCES airports(code) ON DELETE CASCADE,
    FOREIGN KEY (dest_code) REFERENCES airports(code) ON DELETE CASCADE
);

-- Table 3: Active Flight Schedules & Radar Telemetry
CREATE TABLE IF NOT EXISTS flight_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_num VARCHAR(20) NOT NULL UNIQUE, -- e.g. AI-101, 6E-205, SG-811
    airline VARCHAR(100) NOT NULL,          -- Air India, IndiGo, SpiceJet, Vistara
    source_code VARCHAR(10) NOT NULL,
    dest_code VARCHAR(10) NOT NULL,
    departure_time VARCHAR(20) NOT NULL,    -- e.g. "06:30 IST"
    arrival_time VARCHAR(20) NOT NULL,      -- e.g. "08:45 IST"
    aircraft VARCHAR(50) DEFAULT 'Airbus A320neo',
    altitude_fl INTEGER DEFAULT 360,        -- Flight Level 360 = 36,000 ft
    speed_knots INTEGER DEFAULT 450,        -- Air speed in knots
    status VARCHAR(50) DEFAULT 'SCHEDULED', -- SCHEDULED, EN_ROUTE, LANDED, REROUTED
    FOREIGN KEY (source_code) REFERENCES airports(code),
    FOREIGN KEY (dest_code) REFERENCES airports(code)
);

-- Table 4: DAA Prim's Algorithm MST Execution History & Performance Metrics
CREATE TABLE IF NOT EXISTS mst_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_hub VARCHAR(10) NOT NULL,
    total_mst_distance_km INTEGER NOT NULL,
    original_mesh_distance_km INTEGER NOT NULL,
    savings_pct DECIMAL(5, 2) NOT NULL,
    edges_count INTEGER NOT NULL,
    delays_saved_minutes INTEGER DEFAULT 0,
    fuel_saved_liters INTEGER DEFAULT 0,
    co2_saved_tons DECIMAL(6, 2) DEFAULT 0,
    execution_time_ms DECIMAL(8, 3) NOT NULL,
    algorithm_variant VARCHAR(50) DEFAULT 'Prims-MinHeap',
    run_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_airports_code ON airports(code);
CREATE INDEX IF NOT EXISTS idx_routes_source ON airway_routes(source_code);
CREATE INDEX IF NOT EXISTS idx_routes_dest ON airway_routes(dest_code);
CREATE INDEX IF NOT EXISTS idx_flights_status ON flight_schedules(status);
