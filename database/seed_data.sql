-- ============================================================================
-- SEED DATA: 16 Major Indian Airport Hubs, 29 Domestic Corridors, Flight Data
-- ============================================================================

-- Airports (Vertices with Capacity & Sector Congestion Load)
INSERT INTO airports (code, name, city, state, latitude, longitude, elevation_ft, runways, capacity_per_hour, current_load_pct, radar_type) VALUES
('DEL', 'Indira Gandhi International Airport', 'New Delhi', 'Delhi NCR', 28.5562, 77.1000, 777, 4, 85, 82, 'MSSR/A-SMGCS'),
('BOM', 'Chhatrapati Shivaji Maharaj Intl Airport', 'Mumbai', 'Maharashtra', 19.0896, 72.8656, 39, 2, 55, 88, 'MSSR/A-SMGCS'),
('BLR', 'Kempegowda International Airport', 'Bengaluru', 'Karnataka', 13.1986, 77.7066, 3000, 2, 50, 68, 'MSSR/CAT III-B'),
('MAA', 'Chennai International Airport', 'Chennai', 'Tamil Nadu', 12.9941, 80.1709, 52, 2, 40, 62, 'MSSR/ASR'),
('CCU', 'Netaji Subhash Chandra Bose Intl Airport', 'Kolkata', 'West Bengal', 22.6547, 88.4467, 16, 2, 38, 54, 'MSSR/ASR'),
('HYD', 'Rajiv Gandhi International Airport', 'Hyderabad', 'Telangana', 17.2403, 78.4294, 2024, 2, 42, 60, 'MSSR/CAT III-B'),
('AMD', 'Sardar Vallabhbhai Patel Intl Airport', 'Ahmedabad', 'Gujarat', 23.0772, 72.6347, 189, 1, 28, 50, 'MSSR/ASR'),
('PNQ', 'Pune International Airport', 'Pune', 'Maharashtra', 18.5822, 73.9197, 1942, 1, 24, 72, 'IAF Radar/Civil MSSR'),
('COK', 'Cochin International Airport', 'Kochi', 'Kerala', 10.1518, 76.3930, 30, 1, 25, 45, 'MSSR/Solar Powered'),
('GAU', 'Lokpriya Gopinath Bordoloi Intl Airport', 'Guwahati', 'Assam', 26.1061, 91.5859, 162, 1, 20, 40, 'MSSR/ASR'),
('JAI', 'Jaipur International Airport', 'Jaipur', 'Rajasthan', 26.8242, 75.8122, 1263, 1, 22, 48, 'MSSR/ASR'),
('LKO', 'Chaudhary Charan Singh Intl Airport', 'Lucknow', 'Uttar Pradesh', 26.7606, 80.8893, 405, 1, 24, 52, 'MSSR/CAT III-B'),
('PAT', 'Jayprakash Narayan Airport', 'Patna', 'Bihar', 25.5913, 85.0880, 170, 1, 20, 65, 'MSSR/ASR'),
('GOI', 'Dabolim / Manohar International Airport', 'Goa', 'Goa', 15.3808, 73.8314, 184, 1, 22, 75, 'Naval MSSR/Civil ASR'),
('SXR', 'Sheikh ul-Alam International Airport', 'Srinagar', 'Jammu & Kashmir', 33.9871, 74.7741, 5458, 1, 16, 58, 'IAF Radar/Civil MSSR'),
('BBI', 'Biju Patnaik International Airport', 'Bhubaneswar', 'Odisha', 20.2444, 85.8178, 146, 1, 18, 38, 'MSSR/ASR');

-- Airway Corridors / Routes (Graph Edges with Kilometers)
INSERT INTO airway_routes (source_code, dest_code, distance_km, corridor_code, frequency_mhz) VALUES
('DEL', 'JAI', 235, 'Q1-NORTH', 124.200),
('DEL', 'LKO', 420, 'W10-CENTRAL', 125.100),
('DEL', 'AMD', 775, 'A474-WEST', 128.300),
('DEL', 'BOM', 1148, 'W20-TRUNK', 120.900),
('DEL', 'SXR', 645, 'V8-HIMALAYA', 121.100),
('DEL', 'PAT', 850, 'Q3-GANGES', 126.700),
('BOM', 'AMD', 440, 'M44-COAST', 119.500),
('BOM', 'PNQ', 120, 'L7-EXPRESS', 123.400),
('BOM', 'GOI', 435, 'W15-KONKAN', 122.800),
('BOM', 'HYD', 620, 'Q2-DECCAN', 127.300),
('BOM', 'BLR', 842, 'W12-SOUTH', 124.900),
('BLR', 'HYD', 500, 'P574-METRO', 125.500),
('BLR', 'MAA', 290, 'Q8-COROMANDEL', 126.100),
('BLR', 'COK', 365, 'W29-MALABAR', 120.300),
('BLR', 'GOI', 480, 'V14-GHATS', 121.700),
('MAA', 'HYD', 515, 'A347-CENTRAL', 123.800),
('MAA', 'COK', 560, 'W33-SOUTHERN', 124.500),
('MAA', 'BBI', 990, 'Q5-BAYOFBENGAL', 127.800),
('CCU', 'BBI', 360, 'W4-EASTCOAST', 122.100),
('CCU', 'PAT', 470, 'W8-BIHARLINK', 125.700),
('CCU', 'GAU', 505, 'V1-NORTHEAST', 128.900),
('CCU', 'LKO', 885, 'Q11-UP', 126.200),
('CCU', 'HYD', 1180, 'W16-CENTRAL', 123.200),
('HYD', 'BBI', 860, 'Q14-ODISHA', 124.000),
('HYD', 'PNQ', 510, 'A2-MAHA', 121.400),
('HYD', 'LKO', 1080, 'W22-HEARTLAND', 125.000),
('LKO', 'PAT', 440, 'P2-PURVANCHAL', 126.900),
('AMD', 'JAI', 535, 'W5-THAR', 127.100),
('GOI', 'COK', 660, 'Q7-COASTLINE', 122.400);

-- Flight Schedules
INSERT INTO flight_schedules (flight_num, airline, source_code, dest_code, departure_time, arrival_time, aircraft, altitude_fl, speed_knots, status) VALUES
('AI-101', 'Air India', 'DEL', 'BOM', '06:00 IST', '08:15 IST', 'Boeing 787 Dreamliner', 380, 485, 'EN_ROUTE'),
('6E-205', 'IndiGo', 'BLR', 'DEL', '07:15 IST', '10:05 IST', 'Airbus A321neo', 360, 460, 'EN_ROUTE'),
('SG-811', 'SpiceJet', 'BOM', 'GOI', '08:30 IST', '09:35 IST', 'Boeing 737 MAX', 280, 410, 'SCHEDULED'),
('UK-992', 'Vistara', 'DEL', 'CCU', '09:00 IST', '11:10 IST', 'Airbus A320neo', 340, 450, 'EN_ROUTE'),
('AI-503', 'Air India', 'HYD', 'BLR', '10:20 IST', '11:30 IST', 'Airbus A320neo', 300, 420, 'SCHEDULED'),
('6E-442', 'IndiGo', 'MAA', 'CCU', '11:00 IST', '13:20 IST', 'Airbus A321neo', 370, 470, 'SCHEDULED'),
('6E-901', 'IndiGo', 'DEL', 'SXR', '06:45 IST', '08:15 IST', 'Airbus A320neo', 350, 430, 'EN_ROUTE'),
('QP-130', 'Akasa Air', 'BOM', 'AMD', '12:00 IST', '13:10 IST', 'Boeing 737 MAX', 290, 400, 'SCHEDULED');
