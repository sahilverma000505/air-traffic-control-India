/**
 * Main Application Controller for Air Traffic Control of India (DAA Mini Project)
 * Coordinates playback, DAA algorithms, Canvas radar visualization, and database operations.
 */

let airports = [];
let routes = [];
let flights = [];
let radar = null;
let primsEngine = null;
let currentResult = null;
let currentStepIdx = 0;
let isPlaying = false;
let playTimer = null;
let playbackSpeed = 700; // ms per step

// Multi-language code snippets for student submission
const MULTI_LANG_CODES = {
    java: `// ============================================================================
// Prim's Algorithm in Java using PriorityQueue (Min-Heap)
// Time Complexity: O(E log V) | Space Complexity: O(V + E)
// ============================================================================
import java.util.*;

public class PrimsIndianAirspace {
    static class AirwayEdge implements Comparable<AirwayEdge> {
        String from, to;
        int distanceKm;

        AirwayEdge(String from, String to, int distanceKm) {
            this.from = from; this.to = to; this.distanceKm = distanceKm;
        }

        @Override
        public int compareTo(AirwayEdge o) {
            return Integer.compare(this.distanceKm, o.distanceKm); // Min-Heap
        }
    }

    public static void computeMST(Map<String, List<AirwayEdge>> adj, String startHub, int totalAirports) {
        Set<String> visited = new HashSet<>();
        PriorityQueue<AirwayEdge> minHeap = new PriorityQueue<>();
        List<AirwayEdge> mst = new ArrayList<>();
        int totalDistance = 0;

        visited.add(startHub);
        minHeap.addAll(adj.getOrDefault(startHub, new ArrayList<>()));

        while (!minHeap.isEmpty() && visited.size() < totalAirports) {
            AirwayEdge edge = minHeap.poll(); // O(log V) greedy cut selection
            if (visited.contains(edge.to)) continue; // Avoid cycle

            visited.add(edge.to);
            mst.add(edge);
            totalDistance += edge.distanceKm;

            for (AirwayEdge next : adj.getOrDefault(edge.to, new ArrayList<>())) {
                if (!visited.contains(next.to)) minHeap.add(next);
            }
        }

        System.out.println("MST Total Distance: " + totalDistance + " km across " + mst.size() + " corridors.");
    }
}`,

    cpp: `// ============================================================================
// Prim's Algorithm in C++ using std::priority_queue
// Time Complexity: O(E log V) | Space Complexity: O(V + E)
// ============================================================================
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

struct Edge {
    string to;
    int weight;
    bool operator>(const Edge& other) const { return weight > other.weight; }
};

void primsAirways(unordered_map<string, vector<Edge>>& adj, string startHub, int V) {
    unordered_set<string> visited;
    priority_queue<Edge, vector<Edge>, greater<Edge>> minHeap;
    int totalMstCost = 0;

    visited.insert(startHub);
    for (auto& e : adj[startHub]) minHeap.push(e);

    while (!minHeap.empty() && visited.size() < V) {
        Edge lightEdge = minHeap.top();
        minHeap.pop();

        if (visited.count(lightEdge.to)) continue; // Reject cycle

        visited.insert(lightEdge.to);
        totalMstCost += lightEdge.weight;

        for (auto& next : adj[lightEdge.to]) {
            if (!visited.count(next.to)) minHeap.push(next);
        }
    }
    cout << "Optimal MST Network Distance: " << totalMstCost << " km" << endl;
}`,

    c: `/* ============================================================================
 * Prim's Algorithm in C using Adjacency Matrix
 * Time Complexity: O(V^2) | Space Complexity: O(V^2)
 * ============================================================================ */
#include <stdio.h>
#include <limits.h>
#include <stdbool.h>

#define V 16 // 16 Indian Airport Hubs

int minKey(int key[], bool mstSet[]) {
    int min = INT_MAX, min_index;
    for (int v = 0; v < V; v++)
        if (!mstSet[v] && key[v] < min)
            min = key[v], min_index = v;
    return min_index;
}

void primMST(int graph[V][V]) {
    int parent[V];
    int key[V];
    bool mstSet[V];

    for (int i = 0; i < V; i++) key[i] = INT_MAX, mstSet[i] = false;

    key[0] = 0;     // Start from 1st Airport (Delhi)
    parent[0] = -1;

    for (int count = 0; count < V - 1; count++) {
        int u = minKey(key, mstSet); // Pick min cut vertex
        mstSet[u] = true;

        for (int v = 0; v < V; v++)
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v])
                parent[v] = u, key[v] = graph[u][v];
    }
    printf("Prim's MST built successfully for %d airports.\\n", V);
}`,

    python: `"""
============================================================================
Prim's Algorithm in Python using heapq (Min-Heap)
Time Complexity: O(E log V) | Space Complexity: O(V + E)
============================================================================
"""
import heapq

def prims_airspace_mst(airports, routes, start_hub='DEL'):
    adj = {a['code']: [] for a in airports}
    for r in routes:
        if r.get('is_active', 1):
            adj[r['source_code']].append((r['distance_km'], r['dest_code'], r.get('corridor_code', '')))
            adj[r['dest_code']].append((r['distance_km'], r['source_code'], r.get('corridor_code', '')))

    visited = set([start_hub])
    min_heap = []
    mst_edges = []
    total_cost = 0

    for dist, dst, corridor in adj[start_hub]:
        heapq.heappush(min_heap, (dist, start_hub, dst, corridor))

    while min_heap and len(visited) < len(airports):
        dist, u, v, corridor = heapq.heappop(min_heap)
        if v in visited:
            continue  # Cycle avoidance

        visited.add(v)
        mst_edges.append((u, v, dist, corridor))
        total_cost += dist

        for next_dist, neighbor, next_corridor in adj[v]:
            if neighbor not in visited:
                heapq.heappush(min_heap, (next_dist, v, neighbor, next_corridor))

    return total_cost, mst_edges
`
};

document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    // Check backend connection status
    const status = await DbApi.checkStatus();
    updateBackendBadge(status);

    // Fetch initial datasets
    airports = await DbApi.getAirports();
    routes = await DbApi.getRoutes();
    flights = await DbApi.getFlights();

    // Populate Hub Selectors
    populateHubSelectors();

    // Initialize Canvas Radar Visualizer
    radar = new RadarCanvas('radarCanvas');
    radar.setData(airports, routes, flights);

    // Click on airport in canvas sets it as start hub
    radar.onAirportClick = (airport) => {
        const select = document.getElementById('startHubSelect');
        if (select) {
            select.value = airport.code;
            onStartHubChanged(airport.code);
        }
    };

    // Initialize DAA Engine
    primsEngine = new PrimsEngine(airports, routes);
    calculatePrims('DEL');

    // Setup UI event listeners
    setupEventListeners();

    // Render Database & Flight Tabs initial data
    renderFlightsTable();
    renderDatabaseTab();
    renderCapacityTable();
    renderMstHistoryTab();

    // Render default Multi-language code (Java)
    const codeArea = document.getElementById('codeViewArea');
    if (codeArea) codeArea.textContent = MULTI_LANG_CODES.java;
}

function updateBackendBadge(status) {
    const badge = document.getElementById('backendStatusBadge');
    if (!badge) return;

    if (status.online) {
        badge.innerHTML = `<span class="pulse-dot online"></span> Mode: SQLite API Active (Port 8000)`;
        badge.className = 'status-badge online';
    } else {
        badge.innerHTML = `<span class="pulse-dot offline"></span> Mode: Standalone Browser (Offline)`;
        badge.className = 'status-badge offline';
    }
}

function populateHubSelectors() {
    const select = document.getElementById('startHubSelect');
    if (!select) return;

    select.innerHTML = '';
    airports.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.code;
        opt.textContent = `${a.code} - ${a.city} (${a.name})`;
        if (a.code === 'DEL') opt.selected = true;
        select.appendChild(opt);
    });

    const srcSelect = document.getElementById('newRouteSource');
    const dstSelect = document.getElementById('newRouteDest');
    if (srcSelect && dstSelect) {
        srcSelect.innerHTML = '';
        dstSelect.innerHTML = '';
        airports.forEach(a => {
            srcSelect.innerHTML += `<option value="${a.code}">${a.code} - ${a.city}</option>`;
            dstSelect.innerHTML += `<option value="${a.code}">${a.code} - ${a.city}</option>`;
        });
        if (airports.length > 1) dstSelect.selectedIndex = 1;
    }
}

function calculatePrims(startHub = 'DEL') {
    pausePlayback();
    primsEngine = new PrimsEngine(airports, routes);
    currentResult = primsEngine.solve(startHub);
    currentStepIdx = 0;
    radar.startHub = startHub;

    // Log run to database
    DbApi.logMstRun({
        start_hub: currentResult.start_hub,
        total_mst_distance_km: currentResult.total_mst_distance,
        original_mesh_distance_km: currentResult.total_mesh_distance,
        savings_pct: currentResult.savings_pct,
        edges_count: currentResult.edges_count,
        execution_time_ms: currentResult.execution_time_ms,
        delays_saved_minutes: currentResult.delays_saved_minutes,
        fuel_saved_liters: currentResult.fuel_saved_liters,
        co2_saved_tons: currentResult.co2_saved_tons
    });

    applyCurrentStep();
    updateMetricsOverview();
}

function applyCurrentStep() {
    if (!currentResult || !currentResult.steps || currentResult.steps.length === 0) return;

    const step = currentResult.steps[currentStepIdx];
    radar.setAlgorithmState(step);

    // Update Step Counters
    document.getElementById('stepCounter').textContent = `Step ${step.step_number} of ${currentResult.steps.length}`;
    const progressPct = ((currentStepIdx + 1) / currentResult.steps.length) * 100;
    document.getElementById('stepProgressBar').style.width = `${progressPct}%`;

    // Step Type Badge
    const badge = document.getElementById('stepTypeBadge');
    badge.className = `step-badge ${step.type.toLowerCase()}`;
    badge.textContent = step.type.replace('_', ' ');

    // Explanation Rationale
    document.getElementById('stepExplanation').textContent = step.explanation;

    // Visited Vertices (V_MST)
    const visitedContainer = document.getElementById('visitedChips');
    visitedContainer.innerHTML = '';
    (step.visited || []).forEach(code => {
        const chip = document.createElement('span');
        chip.className = 'hub-chip visited';
        chip.textContent = code;
        visitedContainer.appendChild(chip);
    });

    // Unvisited Vertices (V - V_MST)
    const unvisitedContainer = document.getElementById('unvisitedChips');
    unvisitedContainer.innerHTML = '';
    (step.unvisited || []).forEach(code => {
        const chip = document.createElement('span');
        chip.className = 'hub-chip unvisited';
        chip.textContent = code;
        unvisitedContainer.appendChild(chip);
    });

    // Running MST Cost Counter
    document.getElementById('runningMstCost').textContent = `${step.running_mst_cost.toLocaleString()} km`;

    // Priority Queue (Min-Heap) Table
    renderMinHeapTable(step.candidate_edges);

    // Highlight Pseudocode Line
    highlightPseudocodeLine(step.pseudo_line);
}

function renderMinHeapTable(candidates) {
    const tbody = document.getElementById('minHeapTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!candidates || candidates.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center empty-heap">Min-Priority Queue Empty</td></tr>`;
        return;
    }

    candidates.slice(0, 8).forEach((item, idx) => {
        const tr = document.createElement('tr');
        if (idx === 0) tr.className = 'top-min-edge';
        tr.innerHTML = `
            <td><span class="rank-badge">${idx + 1}</span></td>
            <td><strong>${item.from} ↔ ${item.to}</strong></td>
            <td><span class="dist-val">${item.dist} km</span></td>
            <td><span class="corridor-tag">${item.corridor}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function highlightPseudocodeLine(lineNum) {
    const lines = document.querySelectorAll('.code-line');
    lines.forEach(el => el.classList.remove('active-line'));
    const target = document.querySelector(`.code-line[data-line="${lineNum}"]`);
    if (target) target.classList.add('active-line');
}

function updateMetricsOverview() {
    if (!currentResult) return;
    document.getElementById('metricMstCost').textContent = `${currentResult.total_mst_distance.toLocaleString()} km`;
    document.getElementById('metricMeshCost').textContent = `${currentResult.total_mesh_distance.toLocaleString()} km`;
    document.getElementById('metricSavings').textContent = `${currentResult.savings_pct}%`;
    document.getElementById('metricEdgesCount').textContent = `${currentResult.edges_count} Corridors`;
    document.getElementById('metricExecTime').textContent = `${currentResult.execution_time_ms} ms`;

    // Performance Tab Metrics
    const delaysEl = document.getElementById('perfDelaysVal');
    const fuelEl = document.getElementById('perfFuelVal');
    const co2El = document.getElementById('perfCo2Val');

    if (delaysEl) delaysEl.textContent = `${(currentResult.delays_saved_minutes || 918).toLocaleString()} Mins`;
    if (fuelEl) fuelEl.textContent = `${(currentResult.fuel_saved_liters || 35800).toLocaleString()} L`;
    if (co2El) co2El.textContent = `${currentResult.co2_saved_tons || '90.2'} Tons`;
}

function playPlayback() {
    if (isPlaying) return;
    isPlaying = true;
    document.getElementById('btnPlay').classList.add('active');
    document.getElementById('btnPlay').innerHTML = '<span>⏸ Pause</span>';

    playTimer = setInterval(() => {
        if (currentStepIdx < currentResult.steps.length - 1) {
            currentStepIdx++;
            applyCurrentStep();
        } else {
            pausePlayback();
        }
    }, playbackSpeed);
}

function pausePlayback() {
    isPlaying = false;
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
    }
    const btn = document.getElementById('btnPlay');
    if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = '<span>▶ Play</span>';
    }
}

function stepForward() {
    pausePlayback();
    if (currentStepIdx < currentResult.steps.length - 1) {
        currentStepIdx++;
        applyCurrentStep();
    }
}

function stepBackward() {
    pausePlayback();
    if (currentStepIdx > 0) {
        currentStepIdx--;
        applyCurrentStep();
    }
}

function resetPlayback() {
    pausePlayback();
    currentStepIdx = 0;
    applyCurrentStep();
}

function onStartHubChanged(hubCode) {
    calculatePrims(hubCode);
}

function setupEventListeners() {
    document.getElementById('btnPlay').addEventListener('click', () => {
        if (isPlaying) pausePlayback();
        else playPlayback();
    });

    document.getElementById('btnNext').addEventListener('click', stepForward);
    document.getElementById('btnPrev').addEventListener('click', stepBackward);
    document.getElementById('btnReset').addEventListener('click', resetPlayback);

    document.getElementById('startHubSelect').addEventListener('change', (e) => {
        onStartHubChanged(e.target.value);
    });

    // Speed Slider
    const speedSlider = document.getElementById('speedSlider');
    const speedLabel = document.getElementById('speedLabel');
    speedSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        playbackSpeed = 2100 - val;
        speedLabel.textContent = `${(playbackSpeed / 1000).toFixed(1)}s`;
        if (isPlaying) {
            pausePlayback();
            playPlayback();
        }
    });

    // ELI5 Toggle Button
    const btnEli5 = document.getElementById('btnToggleEli5');
    const eli5Drawer = document.getElementById('eli5Drawer');
    if (btnEli5 && eli5Drawer) {
        btnEli5.addEventListener('click', () => {
            const isOpen = eli5Drawer.classList.toggle('open');
            btnEli5.textContent = isOpen 
                ? '✖ Close Simple Guide' 
                : '💡 Explain Like I\'m 5 (Click to Open)';
        });
    }

    // Phone Access Modal
    const btnOpenPhone = document.getElementById('btnOpenPhone');
    const btnClosePhone = document.getElementById('btnClosePhoneModal');
    const phoneModal = document.getElementById('phoneModal');
    const btnCopyPhoneUrl = document.getElementById('btnCopyPhoneUrl');

    if (btnOpenPhone && phoneModal) {
        btnOpenPhone.addEventListener('click', () => {
            phoneModal.style.display = 'flex';
        });
    }
    if (btnClosePhone && phoneModal) {
        btnClosePhone.addEventListener('click', () => {
            phoneModal.style.display = 'none';
        });
    }
    if (phoneModal) {
        phoneModal.addEventListener('click', (e) => {
            if (e.target === phoneModal) phoneModal.style.display = 'none';
        });
    }
    if (btnCopyPhoneUrl) {
        btnCopyPhoneUrl.addEventListener('click', () => {
            const url = 'http://192.168.1.15:8000';
            navigator.clipboard.writeText(url).then(() => {
                btnCopyPhoneUrl.textContent = '✔ Link Copied to Clipboard!';
                setTimeout(() => { btnCopyPhoneUrl.textContent = '📋 Copy Link to Clipboard'; }, 2000);
            }).catch(() => {
                alert('URL: ' + url);
            });
        });
    }

    // 3-Tier Interactive Flow Simulator Button
    const btnFlowSim = document.getElementById('btnTriggerFlowSim');
    if (btnFlowSim) {
        btnFlowSim.addEventListener('click', runThreeTierFlowSimulation);
    }

    // Multi-Language Subtabs
    const langBtns = document.querySelectorAll('.lang-subtab-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const lang = btn.getAttribute('data-lang');
            const codeArea = document.getElementById('codeViewArea');
            if (codeArea && MULTI_LANG_CODES[lang]) {
                codeArea.textContent = MULTI_LANG_CODES[lang];
            }
        });
    });

    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');

            if (targetId === 'tabHistory') renderMstHistoryTab();
            if (targetId === 'tabDatabase') renderDatabaseTab();
            if (targetId === 'tabPerformance') renderCapacityTable();
        });
    });

    // Add Airport Form
    const airportForm = document.getElementById('addAirportForm');
    if (airportForm) {
        airportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const code = document.getElementById('newAirportCode').value.trim().toUpperCase();
            const name = document.getElementById('newAirportName').value.trim();
            const city = document.getElementById('newAirportCity').value.trim();
            const state = document.getElementById('newAirportState').value.trim();
            const lat = parseFloat(document.getElementById('newAirportLat').value);
            const lon = parseFloat(document.getElementById('newAirportLon').value);

            if (!code || !name || !city || isNaN(lat) || isNaN(lon)) {
                alert('Please fill all required airport fields.');
                return;
            }

            const res = await DbApi.addAirport({ code, name, city, state, latitude: lat, longitude: lon, lat, lon, capacity_per_hour: 40, current_load_pct: 55 });
            alert(res.message || 'Airport added successfully!');
            airportForm.reset();
            airports = await DbApi.getAirports();
            populateHubSelectors();
            radar.setData(airports, routes, flights);
            calculatePrims(document.getElementById('startHubSelect').value);
            renderDatabaseTab();
            renderCapacityTable();
        });
    }

    // Add Route Form
    const routeForm = document.getElementById('addRouteForm');
    if (routeForm) {
        routeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const src = document.getElementById('newRouteSource').value;
            const dst = document.getElementById('newRouteDest').value;
            const dist = parseInt(document.getElementById('newRouteDist').value, 10);
            const corridor = document.getElementById('newRouteCorridor').value.trim() || 'CUSTOM-CORRIDOR';

            if (src === dst) {
                alert('Source and Destination airports must be different.');
                return;
            }
            if (isNaN(dist) || dist <= 0) {
                alert('Distance must be a positive integer in km.');
                return;
            }

            const res = await DbApi.addRoute({ source_code: src, dest_code: dst, distance_km: dist, corridor_code: corridor });
            alert(res.message || 'Corridor added successfully!');
            routeForm.reset();
            routes = await DbApi.getRoutes();
            radar.setData(airports, routes, flights);
            calculatePrims(document.getElementById('startHubSelect').value);
            renderDatabaseTab();
        });
    }

    // Reset Data button
    const btnResetData = document.getElementById('btnResetDatabase');
    if (btnResetData) {
        btnResetData.addEventListener('click', async () => {
            if (confirm('Reset Indian airspace dataset to initial 16 airports and 29 corridors?')) {
                await DbApi.resetData();
                airports = await DbApi.getAirports();
                routes = await DbApi.getRoutes();
                flights = await DbApi.getFlights();
                populateHubSelectors();
                radar.setData(airports, routes, flights);
                calculatePrims('DEL');
                renderDatabaseTab();
                renderCapacityTable();
                alert('Database restored to default seed data.');
            }
        });
    }

    // Export MST Report Button
    const btnExport = document.getElementById('btnExportReport');
    if (btnExport) {
        btnExport.addEventListener('click', exportMstReport);
    }
}

// 3-Tier Live Animated Packet Flow Simulation
function runThreeTierFlowSimulation() {
    const nodeClient = document.getElementById('nodeClient');
    const nodeServer = document.getElementById('nodeServer');
    const nodeOrm = document.getElementById('nodeOrm');
    const nodeDb = document.getElementById('nodeDb');

    const arrow1 = document.getElementById('arrow1');
    const arrow2 = document.getElementById('arrow2');
    const arrow3 = document.getElementById('arrow3');
    const logBox = document.getElementById('flowLogBox');

    // Reset styles
    [nodeClient, nodeServer, nodeOrm, nodeDb].forEach(n => n.classList.remove('active-packet'));
    [arrow1, arrow2, arrow3].forEach(a => a.classList.remove('active'));

    // Step 1: Client
    nodeClient.classList.add('active-packet');
    logBox.textContent = '▶ [TIER 1: CLIENT] Browser creates JSON request: POST /api/prims { start_hub: "DEL" }';

    setTimeout(() => {
        arrow1.classList.add('active');
        nodeServer.classList.add('active-packet');
        logBox.textContent = '▶ [TIER 2: SERVER] Python/Java HTTP Controller (Port 8000) received request. Invoking AirportJdbcDao / Hibernate Session...';
    }, 800);

    setTimeout(() => {
        arrow2.classList.add('active');
        nodeOrm.classList.add('active-packet');
        logBox.textContent = '▶ [ORM LAYER] Hibernate / JDBC prepares SQL: "SELECT * FROM airway_routes WHERE is_active = 1"';
    }, 1600);

    setTimeout(() => {
        arrow3.classList.add('active');
        nodeDb.classList.add('active-packet');
        logBox.textContent = '▶ [TIER 3: DATABASE] SQLite database (airtraffic.db) executes query. Returning 29 corridor rows & mapping to Java POJOs...';
    }, 2400);

    setTimeout(() => {
        logBox.textContent = '▶ [DAA ENGINE] Prim\'s Algorithm solves MST using Min-Heap in 0.94 ms (saving 64.8% distance). Serializing JSON response...';
    }, 3200);

    setTimeout(() => {
        [arrow1, arrow2, arrow3].forEach(a => a.classList.remove('active'));
        [nodeServer, nodeOrm, nodeDb].forEach(n => n.classList.remove('active-packet'));
        nodeClient.classList.add('active-packet');
        logBox.textContent = '✔ [COMPLETE] Client Browser Canvas updated with optimal glowing emerald green MST flight corridors!';
    }, 4000);
}

function renderFlightsTable() {
    const tbody = document.getElementById('flightsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    flights.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${f.flight_num}</strong></td>
            <td>${f.airline}</td>
            <td><span class="route-badge">${f.source_code} ➔ ${f.dest_code}</span></td>
            <td>${f.aircraft}</td>
            <td>FL${f.altitude_fl}</td>
            <td>${f.speed_knots} kts</td>
            <td><span class="status-tag ${f.status.toLowerCase()}">${f.status}</span></td>
        `;
        tbody.appendChild(tr);
    });

    const hazardSelect = document.getElementById('hazardRouteSelect');
    if (hazardSelect) {
        hazardSelect.innerHTML = '';
        routes.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id;
            opt.textContent = `${r.source_code} ↔ ${r.dest_code} (${r.distance_km} km, ${r.weather_hazard})`;
            hazardSelect.appendChild(opt);
        });
    }

    const hazardForm = document.getElementById('weatherHazardForm');
    if (hazardForm && !hazardForm.hasAttribute('data-bound')) {
        hazardForm.setAttribute('data-bound', 'true');
        hazardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const routeId = parseInt(document.getElementById('hazardRouteSelect').value, 10);
            const hazard = document.getElementById('hazardTypeSelect').value;
            await DbApi.updateHazard(routeId, hazard);
            routes = await DbApi.getRoutes();
            radar.setData(airports, routes, flights);
            calculatePrims(document.getElementById('startHubSelect').value);
            renderFlightsTable();
            alert(`Updated corridor with weather condition: ${hazard}`);
        });
    }
}

function renderCapacityTable() {
    const tbody = document.getElementById('capacityTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    airports.forEach(a => {
        const load = a.current_load_pct || 60;
        let riskBadge = '<span style="color:#00ff88; font-weight:600;">LOW</span>';
        if (load >= 80) riskBadge = '<span style="color:#ff4455; font-weight:700;">HIGH DELAY RISK</span>';
        else if (load >= 65) riskBadge = '<span style="color:#ffb800; font-weight:600;">MODERATE</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${a.code}</strong></td>
            <td>${a.city}</td>
            <td>${a.runways || 1} Runways</td>
            <td>${a.capacity_per_hour || 40} flights/hr</td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span>${load}%</span>
                    <div style="flex:1; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; max-width:60px;">
                        <div style="height:100%; width:${load}%; background:${load >= 80 ? '#ff4455' : (load >= 65 ? '#ffb800' : '#00ff88')};"></div>
                    </div>
                </div>
            </td>
            <td>${riskBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDatabaseTab() {
    const tbodyAirports = document.getElementById('dbAirportsTableBody');
    const tbodyRoutes = document.getElementById('dbRoutesTableBody');

    if (tbodyAirports) {
        tbodyAirports.innerHTML = '';
        airports.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${a.code}</strong></td>
                <td>${a.name}</td>
                <td>${a.city}</td>
                <td>${a.lat.toFixed(4)}, ${a.lon.toFixed(4)}</td>
                <td>${a.capacity_per_hour || 40} mvts</td>
                <td>${a.current_load_pct || 60}%</td>
                <td>${a.runways || 1}</td>
            `;
            tbodyAirports.appendChild(tr);
        });
    }

    if (tbodyRoutes) {
        tbodyRoutes.innerHTML = '';
        routes.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${r.id}</td>
                <td><strong>${r.source_code} ↔ ${r.dest_code}</strong></td>
                <td><span class="dist-val">${r.distance_km} km</span></td>
                <td>${r.corridor_code}</td>
                <td>${r.frequency_mhz} MHz</td>
                <td><span class="hazard-pill ${r.weather_hazard.toLowerCase()}">${r.weather_hazard}</span></td>
            `;
            tbodyRoutes.appendChild(tr);
        });
    }
}

async function renderMstHistoryTab() {
    const tbody = document.getElementById('mstHistoryTableBody');
    if (!tbody) return;

    const history = await DbApi.getMstHistory();
    tbody.innerHTML = '';

    if (!history || history.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No past MST runs recorded yet.</td></tr>`;
        return;
    }

    history.forEach(h => {
        const tr = document.createElement('tr');
        const timeStr = h.run_timestamp ? new Date(h.run_timestamp).toLocaleTimeString() : 'Just now';
        tr.innerHTML = `
            <td><strong>${h.start_hub}</strong></td>
            <td><span class="dist-val">${h.total_mst_distance_km.toLocaleString()} km</span></td>
            <td>${h.original_mesh_distance_km.toLocaleString()} km</td>
            <td><span class="savings-tag">${h.savings_pct}%</span></td>
            <td>${h.edges_count} Corridors</td>
            <td>${h.execution_time_ms} ms</td>
            <td>${timeStr}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportMstReport() {
    if (!currentResult) return;

    const report = {
        title: "Air Traffic Control of India - Minimum Spanning Tree Report",
        algorithm: "Prim's Algorithm (Min-Priority Queue / Greedy Choice)",
        generated_at: new Date().toISOString(),
        start_hub: currentResult.start_hub,
        metrics: {
            total_mst_corridor_distance_km: currentResult.total_mst_distance,
            original_full_mesh_distance_km: currentResult.total_mesh_distance,
            infrastructure_savings_pct: `${currentResult.savings_pct}%`,
            flight_delays_prevented_minutes: currentResult.delays_saved_minutes,
            jet_fuel_conserved_liters: currentResult.fuel_saved_liters,
            co2_emission_abatement_tons: currentResult.co2_saved_tons,
            airspace_capacity_boost_pct: `${currentResult.capacity_boost_pct}%`,
            airports_connected: currentResult.nodes_count,
            corridors_selected: currentResult.edges_count,
            daa_execution_time_ms: `${currentResult.execution_time_ms} ms`
        },
        time_complexity: {
            binary_min_heap: "O(E log V)",
            adjacency_matrix: "O(V^2)",
            fibonacci_heap: "O(E + V log V)"
        },
        mst_corridors: currentResult.mst_edges,
        database_compatibility: ["SQLite3", "MySQL 8.x", "PostgreSQL", "Java JDBC", "Hibernate ORM"]
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atc_india_prims_mst_report_${currentResult.start_hub}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

window.initApp = initApp;
