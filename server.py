"""
Air Traffic Control of India - DAA Mini Project Backend Server
Built using Python Standard Library (http.server, sqlite3, json, urllib)
Zero external dependencies required - runs immediately on any system with Python 3!
"""

import http.server
import socketserver
import json
import urllib.parse
import os
import sys

# Ensure backend package is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from backend.db_manager import (
    init_database,
    get_all_airports,
    get_all_routes,
    get_all_flights,
    add_airport,
    add_route,
    update_hazard,
    log_mst_run,
    get_mst_history
)
from backend.prims_solver import PrimsAlgorithmSolver

PORT = 8000

class ATCRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CURRENT_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def parse_json_body(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode('utf-8')
                return json.loads(raw_data)
        except Exception as e:
            print(f"Error parsing JSON body: {e}")
        return {}

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == '/api/status':
            airports = get_all_airports()
            routes = get_all_routes()
            return self.send_json({
                'status': 'online',
                'backend': 'Python SQLite3',
                'airports_count': len(airports),
                'routes_count': len(routes),
                'jdbc_hibernate_ready': True
            })

        elif path == '/api/airports':
            return self.send_json(get_all_airports())

        elif path == '/api/routes':
            return self.send_json(get_all_routes())

        elif path == '/api/flights':
            return self.send_json(get_all_flights())

        elif path == '/api/history':
            return self.send_json(get_mst_history())

        # Fallback to standard static file serving (HTML, CSS, JS)
        return super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        body = self.parse_json_body()

        if path == '/api/prims':
            # Run Prim's algorithm
            start_hub = body.get('start_hub', 'DEL').upper()
            airports = get_all_airports()
            routes = get_all_routes()
            solver = PrimsAlgorithmSolver(airports, routes)
            result = solver.solve(start_hub)

            # Persist to MST audit history
            if result.get('success'):
                log_mst_run(
                    start_hub=result['start_hub'],
                    total_mst=result['total_mst_distance'],
                    original_mesh=result['total_mesh_distance'],
                    savings_pct=result['savings_pct'],
                    edges_count=result['edges_count'],
                    exec_time_ms=result['execution_time_ms'],
                    delays_saved=result.get('delays_saved_minutes', 0),
                    fuel_saved=result.get('fuel_saved_liters', 0),
                    co2_saved=result.get('co2_saved_tons', 0.0)
                )

            return self.send_json(result)

        elif path == '/api/airports':
            try:
                new_id = add_airport(
                    code=body['code'],
                    name=body['name'],
                    city=body['city'],
                    state=body.get('state', 'India'),
                    lat=body['latitude'],
                    lon=body['longitude'],
                    elevation=body.get('elevation_ft', 0),
                    runways=body.get('runways', 1),
                    radar_type=body.get('radar_type', 'MSSR')
                )
                return self.send_json({'success': True, 'id': new_id, 'message': f"Airport {body['code']} added."})
            except Exception as e:
                return self.send_json({'success': False, 'error': str(e)}, status_code=400)

        elif path == '/api/routes':
            try:
                new_id = add_route(
                    source_code=body['source_code'],
                    dest_code=body['dest_code'],
                    distance_km=body['distance_km'],
                    corridor_code=body.get('corridor_code', 'CUSTOM-AIRWAY'),
                    frequency=body.get('frequency_mhz', 122.500)
                )
                return self.send_json({'success': True, 'id': new_id, 'message': 'Airway corridor added.'})
            except Exception as e:
                return self.send_json({'success': False, 'error': str(e)}, status_code=400)

        elif path == '/api/hazard':
            try:
                route_id = body['route_id']
                hazard = body.get('hazard', 'CLEAR')
                is_active = body.get('is_active', 1)
                update_hazard(route_id, hazard, is_active)
                return self.send_json({'success': True, 'message': f'Route #{route_id} updated with {hazard}.'})
            except Exception as e:
                return self.send_json({'success': False, 'error': str(e)}, status_code=400)

        elif path == '/api/reset':
            init_database(force=True)
            return self.send_json({'success': True, 'message': 'Database reset to initial Indian Airspace dataset.'})

        return self.send_json({'error': 'Not Found'}, status_code=404)

def run_server():
    init_database(force=False)
    # Enable address reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ATCRequestHandler) as httpd:
        print("=" * 70)
        print("  AIR TRAFFIC CONTROL OF INDIA - PRIM'S ALGORITHM (DAA MINI PROJECT)")
        print(f"  Server running at: http://localhost:{PORT}")
        print("  Database: SQLite (database/airtraffic.db)")
        print("  Ready for JDBC & Hibernate integration")
        print("=" * 70)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server gracefully...")
            httpd.server_close()

if __name__ == '__main__':
    run_server()
