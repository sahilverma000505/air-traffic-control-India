/**
 * Interactive HTML5 Radar Map for Air Traffic Control of India
 * Renders calibrated Indian airspace coordinates, radar sweep,
 * Prim's MST tree, candidate cut edges, and real-time aircraft animations.
 */

class RadarCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Calibrated Indian geographical bounding box
        this.bounds = {
            minLat: 7.5,
            maxLat: 36.5,
            minLon: 67.5,
            maxLon: 96.5
        };

        this.airports = [];
        this.routes = [];
        this.flights = [];
        this.mstEdges = new Set();
        this.candidateEdges = [];
        this.activeHub = null;
        this.visitedHubs = new Set();
        this.highlightEdge = null;
        this.hoveredAirport = null;
        this.hoveredRoute = null;
        this.startHub = 'DEL';

        // Radar animation state
        this.sweepAngle = 0;
        this.lastTime = performance.now();
        this.aircraftPositions = []; // { flight, progress, speed, dir, currentSrc, currentDst }

        this.initCanvasSize();
        this.setupEvents();
        this.initAircraft();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    initCanvasSize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = Math.max(560, rect.height) * dpr;
        this.ctx.scale(dpr, dpr);
        this.cssWidth = rect.width;
        this.cssHeight = Math.max(560, rect.height);
    }

    setData(airports, routes, flights) {
        this.airports = airports || [];
        this.routes = routes || [];
        this.flights = flights || [];
        this.initAircraft();
    }

    initAircraft() {
        this.aircraftPositions = [];
        const activeFlights = this.flights.filter(f => f.status === 'EN_ROUTE');
        activeFlights.forEach((f, idx) => {
            this.aircraftPositions.push({
                flight: f,
                progress: (idx * 0.25) % 1.0,
                speed: 0.0008 + (idx * 0.0002)
            });
        });
    }

    setAlgorithmState(step) {
        if (!step) {
            this.mstEdges.clear();
            this.candidateEdges = [];
            this.visitedHubs.clear();
            this.activeHub = null;
            this.highlightEdge = null;
            return;
        }

        this.visitedHubs = new Set(step.visited || []);
        this.activeHub = step.current_hub;
        this.highlightEdge = step.selected_edge;

        // Populate MST edge keys
        this.mstEdges.clear();
        (step.mst_edges || []).forEach(e => {
            const key = [e.from, e.to].sort().join('-');
            this.mstEdges.add(key);
        });

        // Candidate cut edges
        this.candidateEdges = (step.candidate_edges || []).map(e => [e.from, e.to].sort().join('-'));
    }

    project(lat, lon) {
        const padX = 45;
        const padY = 45;
        const w = this.cssWidth - padX * 2;
        const h = this.cssHeight - padY * 2;

        const x = padX + ((lon - this.bounds.minLon) / (this.bounds.maxLon - this.bounds.minLon)) * w;
        // Invert Y because latitude grows North (upwards)
        const y = padY + ((this.bounds.maxLat - lat) / (this.bounds.maxLat - this.bounds.minLat)) * h;

        return { x, y };
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.initCanvasSize();
        });

        const handlePointer = (clientX, clientY) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = clientX - rect.left;
            const mouseY = clientY - rect.top;

            let foundAirport = null;
            for (const a of this.airports) {
                const pt = this.project(a.lat, a.lon);
                const dist = Math.hypot(pt.x - mouseX, pt.y - mouseY);
                if (dist <= 22) { // 22px hit area for fingers
                    foundAirport = a;
                    break;
                }
            }
            this.hoveredAirport = foundAirport;
            this.canvas.style.cursor = foundAirport ? 'pointer' : 'default';
            return foundAirport;
        };

        this.canvas.addEventListener('mousemove', (e) => {
            handlePointer(e.clientX, e.clientY);
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.hoveredAirport && typeof this.onAirportClick === 'function') {
                this.onAirportClick(this.hoveredAirport);
            }
        });

        // Mobile Touch Support
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const airport = handlePointer(e.touches[0].clientX, e.touches[0].clientY);
                if (airport && typeof this.onAirportClick === 'function') {
                    this.onAirportClick(airport);
                }
            }
        }, { passive: true });

        this.canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handlePointer(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
    }

    animate(now) {
        const delta = now - this.lastTime;
        this.lastTime = now;

        // Rotate radar sweep
        this.sweepAngle = (this.sweepAngle + 0.015) % (Math.PI * 2);

        // Update simulated aircraft
        this.aircraftPositions.forEach(ap => {
            ap.progress = (ap.progress + ap.speed) % 1.0;
        });

        this.draw();
        requestAnimationFrame(this.animate);
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);

        // 1. Background Grid & Radar Rings
        this.drawRadarBackground(ctx);

        // 2. Corridors / Edges (Airways)
        this.drawAirwayRoutes(ctx);

        // 3. Radar Sweep Line & Phosphor Glow
        this.drawRadarSweep(ctx);

        // 4. Airport Vertices
        this.drawAirports(ctx);

        // 5. Active Aircraft Simulation
        this.drawAircraft(ctx);

        // 6. Tooltip on Hover
        if (this.hoveredAirport) {
            this.drawAirportTooltip(ctx, this.hoveredAirport);
        }
    }

    drawRadarBackground(ctx) {
        const cx = this.cssWidth * 0.45;
        const cy = this.cssHeight * 0.52;
        const maxR = Math.min(this.cssWidth, this.cssHeight) * 0.48;

        // Concentric Range Rings (500 km, 1000 km, 1500 km)
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
        ctx.lineWidth = 1;

        for (let r = 70; r <= maxR; r += 70) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();

            // Nautical distance indicator label
            ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText(`${r * 4} KM`, cx + r + 4, cy - 2);
        }

        // Crosshairs / Compass Bearings
        ctx.beginPath();
        ctx.moveTo(cx - maxR - 20, cy);
        ctx.lineTo(cx + maxR + 20, cy);
        ctx.moveTo(cx, cy - maxR - 20);
        ctx.lineTo(cx, cy + maxR + 20);
        ctx.stroke();

        // Compass Cardinal directions
        ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('N 000°', cx - 18, cy - maxR - 8);
        ctx.fillText('S 180°', cx - 18, cy + maxR + 18);
        ctx.fillText('E 090°', cx + maxR + 8, cy + 4);
        ctx.fillText('W 270°', cx - maxR - 44, cy + 4);

        ctx.restore();
    }

    drawAirwayRoutes(ctx) {
        const airportMap = new Map();
        this.airports.forEach(a => airportMap.set(a.code, a));

        const now = performance.now();
        const pulse = (Math.sin(now / 200) + 1) / 2;

        this.routes.forEach(route => {
            const src = airportMap.get(route.source_code);
            const dst = airportMap.get(route.dest_code);
            if (!src || !dst) return;

            const p1 = this.project(src.lat, src.lon);
            const p2 = this.project(dst.lat, dst.lon);
            const key = [src.code, dst.code].sort().join('-');

            const isMst = this.mstEdges.has(key);
            const isCandidate = this.candidateEdges.includes(key);
            const isHighlighted = this.highlightEdge && 
                (([this.highlightEdge.from, this.highlightEdge.to].sort().join('-')) === key);
            const isHazard = route.weather_hazard && route.weather_hazard !== 'CLEAR';

            ctx.save();

            if (isMst) {
                // PRIM'S ACCEPTED MST CORRIDOR: Radiant Neon Emerald Green
                ctx.strokeStyle = '#00ff88';
                ctx.lineWidth = 3.5;
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                // Draw distance pill in the center of MST corridor
                this.drawDistancePill(ctx, p1, p2, `${route.distance_km} km`, '#00ff88', '#071618');

            } else if (isCandidate) {
                // CANDIDATE CUT EDGE IN MIN-HEAP: Pulsing Golden Amber
                ctx.strokeStyle = `rgba(255, 184, 0, ${0.4 + pulse * 0.6})`;
                ctx.lineWidth = 2.5;
                ctx.setLineDash([6, 6]);
                ctx.lineDashOffset = -(now / 40);
                ctx.shadowColor = '#ffb800';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                this.drawDistancePill(ctx, p1, p2, `${route.distance_km} km`, '#ffb800', '#1c1503');

            } else if (isHazard) {
                // WEATHER HAZARD (Storm / Closed Airspace): Alert Coral Red
                ctx.strokeStyle = '#ff4455';
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.shadowColor = '#ff4455';
                ctx.shadowBlur = 6;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                this.drawDistancePill(ctx, p1, p2, `⚡ ${route.weather_hazard}`, '#ff4455', '#240608');

            } else {
                // REGULAR AIRWAY CORRIDOR: Subtle radar vector
                ctx.strokeStyle = 'rgba(0, 180, 255, 0.18)';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }

            ctx.restore();
        });
    }

    drawDistancePill(ctx, p1, p2, text, strokeColor, bgColor) {
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.save();
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        const metrics = ctx.measureText(text);
        const pad = 4;
        const w = metrics.width + pad * 2;
        const h = 14;

        ctx.fillStyle = bgColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(midX - w / 2, midY - h / 2, w, h, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = strokeColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, midX, midY + 1);
        ctx.restore();
    }

    drawRadarSweep(ctx) {
        const cx = this.cssWidth * 0.45;
        const cy = this.cssHeight * 0.52;
        const maxR = Math.min(this.cssWidth, this.cssHeight) * 0.48;

        ctx.save();
        const startAngle = this.sweepAngle;
        const endAngle = this.sweepAngle - 0.4;

        // Faint sector glow
        const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxR);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0.0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, endAngle, startAngle, false);
        ctx.closePath();
        ctx.fill();

        // Bright sweep line
        const lx = cx + Math.cos(this.sweepAngle) * maxR;
        const ly = cy + Math.sin(this.sweepAngle) * maxR;
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.7)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(lx, ly);
        ctx.stroke();

        ctx.restore();
    }

    drawAirports(ctx) {
        const now = performance.now();
        const pulse = (Math.sin(now / 220) + 1) / 2;

        this.airports.forEach(airport => {
            const pt = this.project(airport.lat, airport.lon);
            const isVisited = this.visitedHubs.has(airport.code);
            const isActive = this.activeHub === airport.code;
            const isStart = this.startHub === airport.code;
            const isHovered = this.hoveredAirport?.code === airport.code;

            ctx.save();

            // Pulsing ring for Active Hub
            if (isActive || isStart) {
                ctx.strokeStyle = isActive ? '#00ff88' : '#00e5ff';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 10 + pulse * 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Outer Beacon Circle
            if (isVisited) {
                ctx.fillStyle = '#00ff88';
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 10;
            } else if (isActive) {
                ctx.fillStyle = '#ffb800';
                ctx.shadowColor = '#ffb800';
                ctx.shadowBlur = 12;
            } else {
                ctx.fillStyle = '#00e5ff';
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 5;
            }

            // Radar Blip Core
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isHovered ? 6.5 : (isVisited ? 5 : 4), 0, Math.PI * 2);
            ctx.fill();

            // Concentric target dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            ctx.fill();

            // Sector Congestion Load Indicator Dot
            const load = airport.current_load_pct || 60;
            const loadColor = load >= 80 ? '#ff4455' : (load >= 65 ? '#ffb800' : '#00ff88');
            ctx.fillStyle = loadColor;
            ctx.beginPath();
            ctx.arc(pt.x - 7, pt.y - 7, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Airport IATA Call-sign text
            ctx.shadowBlur = 0;
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.fillStyle = isVisited ? '#00ff88' : (isActive ? '#ffb800' : '#d8f3ff');
            ctx.fillText(airport.code, pt.x + 8, pt.y - 4);

            // City Sub-label
            ctx.font = '8.5px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fillText(airport.city, pt.x + 8, pt.y + 7);

            ctx.restore();
        });
    }

    drawAircraft(ctx) {
        const airportMap = new Map();
        this.airports.forEach(a => airportMap.set(a.code, a));

        this.aircraftPositions.forEach(ap => {
            const flight = ap.flight;
            const src = airportMap.get(flight.source_code);
            const dst = airportMap.get(flight.dest_code);
            if (!src || !dst) return;

            const p1 = this.project(src.lat, src.lon);
            const p2 = this.project(dst.lat, dst.lon);

            // Interpolate position
            const x = p1.x + (p2.x - p1.x) * ap.progress;
            const y = p1.y + (p2.y - p1.y) * ap.progress;

            // Heading angle
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // Aircraft silhouette (triangle / jet)
            ctx.fillStyle = '#ffcc00';
            ctx.shadowColor = '#ffcc00';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(7, 0);
            ctx.lineTo(-6, -4.5);
            ctx.lineTo(-3, 0);
            ctx.lineTo(-6, 4.5);
            ctx.closePath();
            ctx.fill();

            // Flight Call-sign tag
            ctx.rotate(-angle);
            ctx.font = 'bold 8px monospace';
            ctx.fillStyle = '#ffcc00';
            ctx.shadowBlur = 0;
            ctx.fillText(`${flight.flight_num} FL${flight.altitude_fl || 340}`, 9, -5);

            ctx.restore();
        });
    }

    drawAirportTooltip(ctx, airport) {
        const pt = this.project(airport.lat, airport.lon);
        ctx.save();

        const boxW = 224;
        const boxH = 118;
        let tx = pt.x + 12;
        let ty = pt.y - 120;

        // Keep inside canvas bounds
        if (tx + boxW > this.cssWidth - 10) tx = pt.x - boxW - 12;
        if (ty < 10) ty = pt.y + 16;

        ctx.fillStyle = 'rgba(7, 16, 28, 0.94)';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = 'rgba(0, 229, 255, 0.4)';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.roundRect(tx, ty, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#00ff88';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillText(`AIRPORT HUB: [${airport.code}]`, tx + 10, ty + 18);

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(airport.name.length > 28 ? airport.name.substring(0, 26) + '...' : airport.name, tx + 10, ty + 32);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`LOCATION: ${airport.city}, ${airport.state}`, tx + 10, ty + 46);
        ctx.fillText(`RUNWAYS: ${airport.runways}  |  ELEV: ${airport.elevation_ft} FT`, tx + 10, ty + 59);

        // Capacity and Sector Congestion Bar
        const load = airport.current_load_pct || 60;
        const loadColor = load >= 80 ? '#ff4455' : (load >= 65 ? '#ffb800' : '#00ff88');
        ctx.fillText(`CAPACITY: ${airport.capacity_per_hour || 40}/hr | LOAD: ${load}%`, tx + 10, ty + 72);
        
        // Progress bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(tx + 10, ty + 77, boxW - 20, 4);
        ctx.fillStyle = loadColor;
        ctx.fillRect(tx + 10, ty + 77, (boxW - 20) * (load / 100), 4);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`RADAR: ${airport.radar_type}`, tx + 10, ty + 95);

        ctx.fillStyle = '#ffb800';
        ctx.fillText(`[Click to set as Start Hub]`, tx + 10, ty + 108);

        ctx.restore();
    }
}

window.RadarCanvas = RadarCanvas;
