/**
 * Default Indian Airspace Dataset (Airports & Domestic Corridors)
 * Enables 100% standalone offline operation in any web browser,
 * while matching the SQLite / MySQL database schema.
 */

const DEFAULT_AIRPORTS = [
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi NCR', lat: 28.5562, lon: 77.1000, elevation_ft: 777, runways: 4, capacity_per_hour: 85, current_load_pct: 82, radar_type: 'MSSR/A-SMGCS' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl Airport', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lon: 72.8656, elevation_ft: 39, runways: 2, capacity_per_hour: 55, current_load_pct: 88, radar_type: 'MSSR/A-SMGCS' },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lon: 77.7066, elevation_ft: 3000, runways: 2, capacity_per_hour: 50, current_load_pct: 68, radar_type: 'MSSR/CAT III-B' },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9941, lon: 80.1709, elevation_ft: 52, runways: 2, capacity_per_hour: 40, current_load_pct: 62, radar_type: 'MSSR/ASR' },
    { code: 'CCU', name: 'Netaji Subhash Chandra Bose Intl Airport', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lon: 88.4467, elevation_ft: 16, runways: 2, capacity_per_hour: 38, current_load_pct: 54, radar_type: 'MSSR/ASR' },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lon: 78.4294, elevation_ft: 2024, runways: 2, capacity_per_hour: 42, current_load_pct: 60, radar_type: 'MSSR/CAT III-B' },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl Airport', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0772, lon: 72.6347, elevation_ft: 189, runways: 1, capacity_per_hour: 28, current_load_pct: 50, radar_type: 'MSSR/ASR' },
    { code: 'PNQ', name: 'Pune International Airport', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lon: 73.9197, elevation_ft: 1942, runways: 1, capacity_per_hour: 24, current_load_pct: 72, radar_type: 'IAF Radar/Civil MSSR' },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', lat: 10.1518, lon: 76.3930, elevation_ft: 30, runways: 1, capacity_per_hour: 25, current_load_pct: 45, radar_type: 'MSSR/Solar Powered' },
    { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi Intl Airport', city: 'Guwahati', state: 'Assam', lat: 26.1061, lon: 91.5859, elevation_ft: 162, runways: 1, capacity_per_hour: 20, current_load_pct: 40, radar_type: 'MSSR/ASR' },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lon: 75.8122, elevation_ft: 1263, runways: 1, capacity_per_hour: 22, current_load_pct: 48, radar_type: 'MSSR/ASR' },
    { code: 'LKO', name: 'Chaudhary Charan Singh Intl Airport', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lon: 80.8893, elevation_ft: 405, runways: 1, capacity_per_hour: 24, current_load_pct: 52, radar_type: 'MSSR/CAT III-B' },
    { code: 'PAT', name: 'Jayprakash Narayan Airport', city: 'Patna', state: 'Bihar', lat: 25.5913, lon: 85.0880, elevation_ft: 170, runways: 1, capacity_per_hour: 20, current_load_pct: 65, radar_type: 'MSSR/ASR' },
    { code: 'GOI', name: 'Dabolim / Manohar International Airport', city: 'Goa', state: 'Goa', lat: 15.3808, lon: 73.8314, elevation_ft: 184, runways: 1, capacity_per_hour: 22, current_load_pct: 75, radar_type: 'Naval MSSR/Civil ASR' },
    { code: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir', lat: 33.9871, lon: 74.7741, elevation_ft: 5458, runways: 1, capacity_per_hour: 16, current_load_pct: 58, radar_type: 'IAF Radar/Civil MSSR' },
    { code: 'BBI', name: 'Biju Patnaik International Airport', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2444, lon: 85.8178, elevation_ft: 146, runways: 1, capacity_per_hour: 18, current_load_pct: 38, radar_type: 'MSSR/ASR' }
];

const DEFAULT_ROUTES = [
    { id: 1, source_code: 'DEL', dest_code: 'JAI', distance_km: 235, corridor_code: 'Q1-NORTH', frequency_mhz: 124.200, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 2, source_code: 'DEL', dest_code: 'LKO', distance_km: 420, corridor_code: 'W10-CENTRAL', frequency_mhz: 125.100, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 3, source_code: 'DEL', dest_code: 'AMD', distance_km: 775, corridor_code: 'A474-WEST', frequency_mhz: 128.300, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 4, source_code: 'DEL', dest_code: 'BOM', distance_km: 1148, corridor_code: 'W20-TRUNK', frequency_mhz: 120.900, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 5, source_code: 'DEL', dest_code: 'SXR', distance_km: 645, corridor_code: 'V8-HIMALAYA', frequency_mhz: 121.100, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 6, source_code: 'DEL', dest_code: 'PAT', distance_km: 850, corridor_code: 'Q3-GANGES', frequency_mhz: 126.700, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 7, source_code: 'BOM', dest_code: 'AMD', distance_km: 440, corridor_code: 'M44-COAST', frequency_mhz: 119.500, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 8, source_code: 'BOM', dest_code: 'PNQ', distance_km: 120, corridor_code: 'L7-EXPRESS', frequency_mhz: 123.400, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 9, source_code: 'BOM', dest_code: 'GOI', distance_km: 435, corridor_code: 'W15-KONKAN', frequency_mhz: 122.800, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 10, source_code: 'BOM', dest_code: 'HYD', distance_km: 620, corridor_code: 'Q2-DECCAN', frequency_mhz: 127.300, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 11, source_code: 'BOM', dest_code: 'BLR', distance_km: 842, corridor_code: 'W12-SOUTH', frequency_mhz: 124.900, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 12, source_code: 'BLR', dest_code: 'HYD', distance_km: 500, corridor_code: 'P574-METRO', frequency_mhz: 125.500, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 13, source_code: 'BLR', dest_code: 'MAA', distance_km: 290, corridor_code: 'Q8-COROMANDEL', frequency_mhz: 126.100, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 14, source_code: 'BLR', dest_code: 'COK', distance_km: 365, corridor_code: 'W29-MALABAR', frequency_mhz: 120.300, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 15, source_code: 'BLR', dest_code: 'GOI', distance_km: 480, corridor_code: 'V14-GHATS', frequency_mhz: 121.700, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 16, source_code: 'MAA', dest_code: 'HYD', distance_km: 515, corridor_code: 'A347-CENTRAL', frequency_mhz: 123.800, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 17, source_code: 'MAA', dest_code: 'COK', distance_km: 560, corridor_code: 'W33-SOUTHERN', frequency_mhz: 124.500, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 18, source_code: 'MAA', dest_code: 'BBI', distance_km: 990, corridor_code: 'Q5-BAYOFBENGAL', frequency_mhz: 127.800, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 19, source_code: 'CCU', dest_code: 'BBI', distance_km: 360, corridor_code: 'W4-EASTCOAST', frequency_mhz: 122.100, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 20, source_code: 'CCU', dest_code: 'PAT', distance_km: 470, corridor_code: 'W8-BIHARLINK', frequency_mhz: 125.700, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 21, source_code: 'CCU', dest_code: 'GAU', distance_km: 505, corridor_code: 'V1-NORTHEAST', frequency_mhz: 128.900, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 22, source_code: 'CCU', dest_code: 'LKO', distance_km: 885, corridor_code: 'Q11-UP', frequency_mhz: 126.200, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 23, source_code: 'CCU', dest_code: 'HYD', distance_km: 1180, corridor_code: 'W16-CENTRAL', frequency_mhz: 123.200, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 24, source_code: 'HYD', dest_code: 'BBI', distance_km: 860, corridor_code: 'Q14-ODISHA', frequency_mhz: 124.000, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 25, source_code: 'HYD', dest_code: 'PNQ', distance_km: 510, corridor_code: 'A2-MAHA', frequency_mhz: 121.400, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 26, source_code: 'HYD', dest_code: 'LKO', distance_km: 1080, corridor_code: 'W22-HEARTLAND', frequency_mhz: 125.000, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 27, source_code: 'LKO', dest_code: 'PAT', distance_km: 440, corridor_code: 'P2-PURVANCHAL', frequency_mhz: 126.900, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 28, source_code: 'AMD', dest_code: 'JAI', distance_km: 535, corridor_code: 'W5-THAR', frequency_mhz: 127.100, is_active: 1, weather_hazard: 'CLEAR' },
    { id: 29, source_code: 'GOI', dest_code: 'COK', distance_km: 660, corridor_code: 'Q7-COASTLINE', frequency_mhz: 122.400, is_active: 1, weather_hazard: 'CLEAR' }
];

const DEFAULT_FLIGHTS = [
    { id: 1, flight_num: 'AI-101', airline: 'Air India', source_code: 'DEL', dest_code: 'BOM', departure_time: '06:00 IST', arrival_time: '08:15 IST', aircraft: 'Boeing 787-8', altitude_fl: 380, speed_knots: 485, status: 'EN_ROUTE' },
    { id: 2, flight_num: '6E-205', airline: 'IndiGo', source_code: 'BLR', dest_code: 'DEL', departure_time: '07:15 IST', arrival_time: '10:05 IST', aircraft: 'Airbus A321neo', altitude_fl: 360, speed_knots: 460, status: 'EN_ROUTE' },
    { id: 3, flight_num: 'SG-811', airline: 'SpiceJet', source_code: 'BOM', dest_code: 'GOI', departure_time: '08:30 IST', arrival_time: '09:35 IST', aircraft: 'Boeing 737 MAX', altitude_fl: 280, speed_knots: 410, status: 'SCHEDULED' },
    { id: 4, flight_num: 'UK-992', airline: 'Vistara', source_code: 'DEL', dest_code: 'CCU', departure_time: '09:00 IST', arrival_time: '11:10 IST', aircraft: 'Airbus A320neo', altitude_fl: 340, speed_knots: 450, status: 'EN_ROUTE' },
    { id: 5, flight_num: 'AI-503', airline: 'Air India', source_code: 'HYD', dest_code: 'BLR', departure_time: '10:20 IST', arrival_time: '11:30 IST', aircraft: 'Airbus A320neo', altitude_fl: 300, speed_knots: 420, status: 'SCHEDULED' },
    { id: 6, flight_num: '6E-442', airline: 'IndiGo', source_code: 'MAA', dest_code: 'CCU', departure_time: '11:00 IST', arrival_time: '13:20 IST', aircraft: 'Airbus A321neo', altitude_fl: 370, speed_knots: 470, status: 'SCHEDULED' },
    { id: 7, flight_num: '6E-901', airline: 'IndiGo', source_code: 'DEL', dest_code: 'SXR', departure_time: '06:45 IST', arrival_time: '08:15 IST', aircraft: 'Airbus A320neo', altitude_fl: 350, speed_knots: 430, status: 'EN_ROUTE' },
    { id: 8, flight_num: 'QP-130', airline: 'Akasa Air', source_code: 'BOM', dest_code: 'AMD', departure_time: '12:00 IST', arrival_time: '13:10 IST', aircraft: 'Boeing 737 MAX', altitude_fl: 290, speed_knots: 400, status: 'SCHEDULED' }
];

window.DEFAULT_AIRPORTS = DEFAULT_AIRPORTS;
window.DEFAULT_ROUTES = DEFAULT_ROUTES;
window.DEFAULT_FLIGHTS = DEFAULT_FLIGHTS;
