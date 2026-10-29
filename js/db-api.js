/**
 * Database & API Bridge for Air Traffic Control of India
 * Dual-Mode:
 *   1. Connected Mode: Interacts with SQLite database via Python REST server (server.py)
 *   2. Standalone Mode: Falls back gracefully to in-browser LocalStorage and default data
 */

const DbApi = {
    isServerOnline: false,

    async checkStatus() {
        try {
            const res = await fetch('/api/status', { method: 'GET', headers: { 'Accept': 'application/json' } });
            if (res.ok) {
                const data = await res.json();
                this.isServerOnline = true;
                return { online: true, details: data };
            }
        } catch (e) {
            // Server offline or opened via file:// protocol
        }
        this.isServerOnline = false;
        return { online: false, details: { backend: 'Local Browser Storage (Offline)' } };
    },

    async getAirports() {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/airports');
                if (res.ok) return await res.json();
            } catch (e) {
                console.warn('API error, falling back to local storage', e);
            }
        }
        const local = localStorage.getItem('atc_airports');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return window.DEFAULT_AIRPORTS || [];
    },

    async getRoutes() {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/routes');
                if (res.ok) return await res.json();
            } catch (e) {
                console.warn('API error, falling back to local storage', e);
            }
        }
        const local = localStorage.getItem('atc_routes');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return window.DEFAULT_ROUTES || [];
    },

    async getFlights() {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/flights');
                if (res.ok) return await res.json();
            } catch (e) {}
        }
        return window.DEFAULT_FLIGHTS || [];
    },

    async addAirport(airport) {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/airports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airport)
                });
                return await res.json();
            } catch (e) {}
        }
        const airports = await this.getAirports();
        airports.push(airport);
        localStorage.setItem('atc_airports', JSON.stringify(airports));
        return { success: true, message: `Airport ${airport.code} saved locally.` };
    },

    async addRoute(route) {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/routes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(route)
                });
                return await res.json();
            } catch (e) {}
        }
        const routes = await this.getRoutes();
        route.id = Date.now();
        routes.push(route);
        localStorage.setItem('atc_routes', JSON.stringify(routes));
        return { success: true, message: `Airway corridor added locally.` };
    },

    async updateHazard(routeId, hazard, isActive = 1) {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/hazard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ route_id: routeId, hazard, is_active: isActive })
                });
                return await res.json();
            } catch (e) {}
        }
        const routes = await this.getRoutes();
        const r = routes.find(item => item.id === routeId);
        if (r) {
            r.weather_hazard = hazard;
            r.is_active = isActive;
            localStorage.setItem('atc_routes', JSON.stringify(routes));
        }
        return { success: true };
    },

    async logMstRun(runData) {
        if (this.isServerOnline) {
            try {
                await fetch('/api/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(runData)
                });
            } catch (e) {}
        }
        const history = this.getMstHistorySync();
        history.unshift({
            ...runData,
            run_timestamp: new Date().toISOString()
        });
        localStorage.setItem('atc_mst_history', JSON.stringify(history.slice(0, 20)));
    },

    getMstHistorySync() {
        const local = localStorage.getItem('atc_mst_history');
        if (local) {
            try { return JSON.parse(local); } catch (e) {}
        }
        return [];
    },

    async getMstHistory() {
        if (this.isServerOnline) {
            try {
                const res = await fetch('/api/history');
                if (res.ok) return await res.json();
            } catch (e) {}
        }
        return this.getMstHistorySync();
    },

    async resetData() {
        if (this.isServerOnline) {
            try {
                await fetch('/api/reset', { method: 'POST' });
            } catch (e) {}
        }
        localStorage.removeItem('atc_airports');
        localStorage.removeItem('atc_routes');
        localStorage.removeItem('atc_mst_history');
        return { success: true };
    }
};

window.DbApi = DbApi;
