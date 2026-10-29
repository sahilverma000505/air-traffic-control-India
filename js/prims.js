/**
 * Design & Analysis of Algorithms (DAA) - Prim's Algorithm Engine (Client-side)
 * Generates interactive step-by-step trace with Min-Heap cut visualization,
 * cycle avoidance detection, and MST cost calculation.
 */

class PrimsEngine {
    constructor(airports, routes) {
        this.airports = airports || [];
        this.routes = routes || [];
        this.airportMap = new Map();
        this.airports.forEach(a => this.airportMap.set(a.code, a));
        this.adjList = new Map();
        this.totalMeshDistance = 0;
        this.buildGraph();
    }

    buildGraph() {
        this.adjList.clear();
        this.totalMeshDistance = 0;
        const seenEdges = new Set();

        this.airports.forEach(a => {
            this.adjList.set(a.code, []);
        });

        this.routes.forEach(r => {
            if (r.is_active === 0) return;

            const u = r.source_code;
            const v = r.dest_code;
            let dist = parseInt(r.distance_km, 10);
            const hazard = r.weather_hazard || 'CLEAR';
            const corridor = r.corridor_code || 'CORRIDOR';

            // Weather penalty
            if (hazard === 'THUNDERSTORM') dist = Math.round(dist * 1.5);
            else if (hazard === 'TURBULENCE') dist = Math.round(dist * 1.2);

            if (this.adjList.has(u) && this.adjList.has(v)) {
                this.adjList.get(u).push({ to: v, dist, orig_dist: parseInt(r.distance_km, 10), corridor, hazard, id: r.id });
                this.adjList.get(v).push({ to: u, dist, orig_dist: parseInt(r.distance_km, 10), corridor, hazard, id: r.id });

                const edgeKey = [u, v].sort().join('-');
                if (!seenEdges.has(edgeKey)) {
                    seenEdges.add(edgeKey);
                    this.totalMeshDistance += parseInt(r.distance_km, 10);
                }
            }
        });
    }

    solve(startHub = 'DEL') {
        const t0 = performance.now();

        if (!this.adjList.has(startHub)) {
            startHub = this.airports[0]?.code || 'DEL';
        }

        const allCodes = Array.from(this.airportMap.keys());
        const visited = new Set([startHub]);
        const mstEdges = [];
        let totalMstDistance = 0;
        const steps = [];
        let stepCount = 1;

        // Min-Priority Queue simulating binary heap: Array of {from, to, dist, corridor, hazard, id}
        const minHeap = [];

        // Add start hub incident edges
        const startEdges = this.adjList.get(startHub) || [];
        startEdges.forEach(edge => {
            minHeap.push({
                from: startHub,
                to: edge.to,
                dist: edge.dist,
                corridor: edge.corridor,
                hazard: edge.hazard,
                id: edge.id
            });
        });
        minHeap.sort((a, b) => a.dist - b.dist);

        // Step 0: Init
        steps.push({
            step_number: stepCount++,
            type: 'INIT',
            pseudo_line: 1,
            current_hub: startHub,
            visited: Array.from(visited),
            unvisited: allCodes.filter(c => !visited.has(c)),
            candidate_edges: [...minHeap],
            selected_edge: null,
            mst_edges: [],
            running_mst_cost: 0,
            explanation: `Initialized Prim's MST starting at Airport Hub [${startHub}]. Inserted all ${minHeap.length} outgoing airway corridors into the Min-Priority Queue.`
        });

        // Loop until all reachable nodes visited or heap empty
        while (minHeap.length > 0 && visited.size < allCodes.length) {
            // Greedy choice: Extract-Min edge from cut
            const edge = minHeap.shift();

            // Check if destination is already visited -> Cycle
            if (visited.has(edge.to)) {
                steps.push({
                    step_number: stepCount++,
                    type: 'CYCLE_SKIP',
                    pseudo_line: 6,
                    current_hub: edge.to,
                    visited: Array.from(visited),
                    unvisited: allCodes.filter(c => !visited.has(c)),
                    candidate_edges: [...minHeap],
                    selected_edge: { ...edge, status: 'REJECTED_CYCLE' },
                    mst_edges: [...mstEdges],
                    running_mst_cost: totalMstDistance,
                    explanation: `Candidate corridor [${edge.from} ↔ ${edge.to}] (${edge.dist} km) rejected. Both endpoints are ALREADY visited, which would form a cycle.`
                });
                continue;
            }

            // Accept edge into MST
            visited.add(edge.to);
            mstEdges.push(edge);
            totalMstDistance += edge.dist;

            // Discover new candidate edges from newly added vertex
            const newNeighbors = this.adjList.get(edge.to) || [];
            let newlyAddedCount = 0;
            newNeighbors.forEach(nb => {
                if (!visited.has(nb.to)) {
                    minHeap.push({
                        from: edge.to,
                        to: nb.to,
                        dist: nb.dist,
                        corridor: nb.corridor,
                        hazard: nb.hazard,
                        id: nb.id
                    });
                    newlyAddedCount++;
                }
            });

            // Re-sort min heap (O(E log V) behavior)
            minHeap.sort((a, b) => a.dist - b.dist);

            steps.push({
                step_number: stepCount++,
                type: 'EDGE_ACCEPTED',
                pseudo_line: 7,
                current_hub: edge.to,
                visited: Array.from(visited),
                unvisited: allCodes.filter(c => !visited.has(c)),
                candidate_edges: [...minHeap],
                selected_edge: edge,
                mst_edges: [...mstEdges],
                running_mst_cost: totalMstDistance,
                explanation: `Greedy Choice: Picked minimum weight cut corridor [${edge.from} ↔ ${edge.to}] (${edge.dist} km, ${edge.corridor}). Added [${edge.to}] to MST. Discovered ${newlyAddedCount} new outgoing corridors.`
            });
        }

        const execTimeMs = (performance.now() - t0).toFixed(2);
        const savingsPct = this.totalMeshDistance > 0 
            ? (((this.totalMeshDistance - totalMstDistance) / this.totalMeshDistance) * 100).toFixed(1) 
            : 0;

        const distSavedKm = Math.max(0, this.totalMeshDistance - totalMstDistance);
        const delaysSavedMinutes = Math.round(distSavedKm * 0.08);
        const fuelSavedLiters = Math.round(distSavedKm * 3.12);
        const co2SavedTons = ((fuelSavedLiters * 2.52) / 1000.0).toFixed(2);
        const capacityBoostPct = 35;

        // Completion Step
        steps.push({
            step_number: stepCount++,
            type: 'COMPLETE',
            pseudo_line: 9,
            current_hub: null,
            visited: Array.from(visited),
            unvisited: allCodes.filter(c => !visited.has(c)),
            candidate_edges: [],
            selected_edge: null,
            mst_edges: [...mstEdges],
            running_mst_cost: totalMstDistance,
            explanation: `Prim's MST Complete! All ${visited.size} Indian Airport Hubs connected using ${mstEdges.length} optimal corridors. Total MST Cost = ${totalMstDistance.toLocaleString()} km (Saved ${savingsPct}% vs full mesh ${this.totalMeshDistance.toLocaleString()} km). Delays averted: ${delaysSavedMinutes.toLocaleString()} mins | Fuel saved: ${fuelSavedLiters.toLocaleString()} L | CO₂ reduced: ${co2SavedTons} tons.`
        });

        return {
            success: true,
            start_hub: startHub,
            mst_edges: mstEdges,
            total_mst_distance: totalMstDistance,
            total_mesh_distance: this.totalMeshDistance,
            savings_pct: savingsPct,
            edges_count: mstEdges.length,
            nodes_count: visited.size,
            execution_time_ms: execTimeMs,
            delays_saved_minutes: delaysSavedMinutes,
            fuel_saved_liters: fuelSavedLiters,
            co2_saved_tons: co2SavedTons,
            capacity_boost_pct: capacityBoostPct,
            steps: steps
        };
    }
}

window.PrimsEngine = PrimsEngine;
