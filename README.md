<div align="center">

# ✈️ Air Traffic Control of India
### Network Optimization & Radar Simulation using Prim's Algorithm (MST)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas%202D-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Aviation%20HUD-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![SQLite](https://img.shields.io/badge/Database-SQLite3%20%7C%20MySQL-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Hibernate](https://img.shields.io/badge/ORM-Hibernate%206%20%26%20JDBC-59666C?logo=hibernate&logoColor=white)](https://hibernate.org/)

<p align="center">
  <b>A full-stack, interactive aviation radar simulator and network optimization system modeling domestic Indian airspace corridors through Prim's Minimum Spanning Tree algorithm.</b>
</p>

[Explore Features](#-key-features) •
[Algorithm Theory](#-algorithm--complexity-analysis) •
[3-Tier Architecture](#-3-tier-system-architecture) •
[Quickstart](#-quickstart--installation) •
[Java JDBC/ORM](#-database--java-jdbc--hibernate-kit)

</div>

---

## 📌 Executive Summary

India's National Airspace System manages thousands of daily domestic flights across major FIR sectors (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, etc.). Connecting every airport directly to every other airport creates an overwhelming **$17,715\text{ km}$** mesh with severe airspace congestion, redundant radar beacons, and excessive telecommunications trunk line costs.

This project formulates the Indian airspace as an undirected weighted graph $G = (V, E, W)$ and applies **Prim's Algorithm (Min-Priority Queue)** to discover the optimal **Minimum Spanning Tree (MST)**:
* **Original Mesh Distance**: $17,715\text{ km}$ across 29 certified corridors.
* **Optimized MST Distance**: **$6,240\text{ km}$ across 15 trunk corridors**.
* **Infrastructure Distance Saved**: **$64.8\%$ reduction** with zero isolated airports.
* **Flight Holding Delays Prevented**: **$\approx 918\text{ minutes}$** ($\approx 15.3\text{ hours}$).
* **Commercial Jet Fuel Conserved**: **$\approx 35,800\text{ Liters}$** ($\approx 28.6\text{ metric tons}$).
* **$\text{CO}_2$ Carbon Footprint Averted**: **$90.2\text{ Tons}$**.

---

## 🌟 Key Features

* **📡 Interactive Canvas Aviation Radar (HTML5 Canvas 2D)**:
  * Geographically calibrated coordinates spanning the Indian subcontinent ($8^\circ\text{N} - 36^\circ\text{N}$, $68^\circ\text{E} - 96^\circ\text{E}$).
  * Continuous rotating radar beam with glowing phosphor persistence trail.
  * Concentric range rings ($500\text{ km}$, $1000\text{ km}$, $1500\text{ km}$) and compass cardinal bearings.
  * Real-time commercial aircraft animations traveling along domestic airways with live callsigns (e.g. `AI-101 FL380`, `6E-205 FL360`).
  * Airport radar blips with hover/touch HUD cards displaying runways, elevation, radar type, handling capacity, and sector load.

* **🎮 Step-by-Step Prim's Algorithm Controller**:
  * Play, Pause, Step Forward, Step Backward, Reset, and Speed Slider ($0.2\text{s}$ to $1.9\text{s}$).
  * **Start Hub Selector**: Start Prim's from Delhi, Mumbai, Bengaluru, etc., to observe the tree expand outward.
  * **Cut Sets Visualization**: Visual segregation of $V_{MST}$ (visited) from $V - V_{MST}$ (unvisited).
  * **Live Min-Priority Queue (Min-Heap)**: Real-time table displaying candidate cut edges sorted ascendingly.
  * **Cycle Avoidance Guard**: Dynamic detection and rejection of edges between already-visited vertices.
  * **Line-by-Line Pseudocode Pointer**: Active line highlights matching algorithm execution state.

* **⚡ Interactive 3-Tier Client ⇄ Server ⇄ Database Flow Simulator**:
  * Clickable animated demonstrator showing simulated data packets traveling between:
    $$\text{Browser Client} \longrightarrow \text{Python/Java REST API} \longrightarrow \text{JDBC / Hibernate ORM} \longrightarrow \text{SQLite Database}$$
  * Logs SQL statements, Java POJO mappings, and Prim's algorithm execution time in milliseconds.

* **⛈️ Weather Hazard & Airspace Disruption Simulator**:
  * Inject severe weather conditions (monsoon storms, turbulence, fog) into any corridor.
  * Corridor weights dynamically spike, triggering Prim's algorithm to compute alternate paths.

* **💻 Multi-Language DAA Implementation Viewer**:
  * Clean, production-ready code tabs for **Java** (`PriorityQueue`), **C++** (`std::priority_queue`), **C** (Adjacency Matrix), and **Python** (`heapq`).

* **📱 Touch & Mobile Friendly**:
  * Responsive layout with full touchscreen support (tap airports on phone screens to inspect or select).
  * Built-in **"Open on Phone"** QR code modal.

* **💡 "Explain Like I'm 5" Mode**:
  * Collapsible beginner guide explaining graphs, Prim's algorithm, servers, databases, and ORMs with friendly everyday analogies.

---

## 🧮 Algorithm & Complexity Analysis

### 1. Mathematical Formulation
* **Graph $G = (V, E, W)$**:
  * $V$: Set of Indian airport vertices ($|V| = 16$).
  * $E$: Set of certified bilateral domestic flight corridors ($|E| = 29$).
  * $W$: Weight function $w(u, v) \in \mathbb{R}^+$ representing distance in kilometers between ground navigation beacons (VOR/DME).
* **Objective**: Find an acyclic subgraph $T = (V, E')$ spanning all vertices such that:
  $$\min \sum_{e \in E'} w(e)$$

### 2. Time & Space Complexity

| Implementation Variant | Time Complexity | Space Complexity | Suitability |
|---|---|---|---|
| **Binary Min-Heap (Our Implementation)** | **$O(E \log V)$** | **$O(V + E)$** | **Optimal for medium/sparse graphs like Indian Airspace** |
| **Adjacency Matrix** | $O(V^2)$ | $O(V^2)$ | Best for dense graphs ($E \approx V^2$) |
| **Fibonacci Heap** | $O(E + V \log V)$ | $O(V + E)$ | Theoretically optimal for very large graphs |

### 3. Proof of Correctness (Cut Property)
For any cut $(S, V - S)$ of vertices in graph $G$, if an edge $e = (u, v)$ is the light edge (minimum weight) crossing the cut, then $e$ must belong to some Minimum Spanning Tree. Prim's algorithm maintains the invariant that the tree grown so far is a subtree of some MST, and at each iteration greedily selects the minimum cut edge crossing $(V_{MST}, V - V_{MST})$.

---

## 🏗️ 3-Tier System Architecture

```
+-----------------------------------------------------------------------------------+
|                            TIER 1: FRONTEND (CLIENT)                              |
|  - HTML5 Canvas Aviation Radar (Rotating Sweep, Range Rings, Aircraft Animation)   |
|  - DAA Algorithm Controller (Play, Pause, Step-by-Step, Speed Slider)              |
|  - Sector Occupancy Heatmap & Delay/Fuel Performance Dashboard                   |
|  - Interactive 3-Tier Architecture Packet Flow Animator (Client ↔ Server ↔ DB)    |
+-----------------------------------------+-----------------------------------------+
                                          | JSON over HTTP REST (Port 8000)
                                          v
+-----------------------------------------------------------------------------------+
|                        TIER 2: BACKEND & DAA ENGINE (SERVER)                      |
|  - Python Standard Library REST API (server.py)                                   |
|  - Prim's Min-Heap Engine (prims_solver.py, O(E log V) complexity)               |
|  - Multi-Language Algorithm Reference (Java, C++, C, Python)                     |
|  - Performance Calculator (Delay reduction, Fuel savings, Sector Capacity)        |
+-----------------------------------------+-----------------------------------------+
                                          | SQL / ORM Queries
                                          v
+-----------------------------------------------------------------------------------+
|                         TIER 3: DATABASE & ORM LAYER                              |
|  - SQLite Database (airtraffic.db) & MySQL-ready schema.sql                       |
|  - JDBC Data Access Layer (AirportJdbcDao.java: PreparedStatement & ResultSet)   |
|  - Hibernate ORM Layer (AirportHibernateDao.java: @Entity, HQL, Session/Tx)       |
|  - Tables: airports, airway_routes, flight_schedules, mst_runs                     |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Quickstart & Installation

### Option 1: 1-Click Launch (Windows)
Double-click `run.bat` in the project root. This boots the lightweight Python SQLite server on port 8000 and automatically opens your default browser.

### Option 2: Running via Command Line
```bash
# Clone the repository
git clone https://github.com/<your-username>/air-traffic-control-india.git

# Navigate into the project directory
cd air-traffic-control-india

# Start the zero-dependency Python server
python server.py
```
Open **`http://localhost:8000`** in any web browser.

### Option 3: Standalone Browser Mode (Zero Dependencies)
Simply double-click `index.html`. The application automatically falls back to **Standalone Browser Mode** using built-in datasets and `localStorage`.

---

## ☕ Database & Java (JDBC / Hibernate) Kit

The directory `database/java_integration_kit/` provides a ready-to-run Java starter kit for lab coursework and advanced database connectivity:

* **`pom.xml`**: Preconfigured Maven build file with dependencies for `sqlite-jdbc`, `mysql-connector-j`, and `hibernate-core 6.x`.
* **`hibernate.cfg.xml`**: Ready-to-use Hibernate configuration file.
* **`src/FullStackDemonstrator.java`**: Runnable Java program demonstrating the complete 3-tier flow from terminal: connects via JDBC, runs Prim's algorithm, and maps entities with Hibernate.
* **`src/entity/`**:
  * `Airport.java` (`@Entity`, `@Table(name="airports")`)
  * `AirwayRoute.java` (`@Entity`, `@Table(name="airway_routes")`)
  * `FlightSchedule.java` (`@Entity`, `@Table(name="flight_schedules")`)
* **`src/dao/`**:
  * `AirportJdbcDao.java`: Demonstrates pure JDBC with `PreparedStatement` and `ResultSet`.
  * `AirportHibernateDao.java`: Demonstrates Hibernate ORM with `Session`, `Transaction`, and HQL.

---

## 📁 Repository Structure

```
air-traffic-control-india/
├── index.html                   # Main interactive ATC & Prim's Dashboard
├── run.bat                      # 1-Click Windows batch launcher
├── server.py                    # Zero-dependency Python HTTP REST server
├── LICENSE                      # MIT Open Source License
├── .gitignore                   # Git exclusion rules
├── README.md                    # Project documentation
├── css/
│   └── style.css                # Aviation Dark HUD styling + 3-tier flow animator
├── js/
│   ├── radar-canvas.js          # Canvas radar map with capacity bars & animated jets
│   ├── prims.js                 # Prim's Algorithm engine (heap trace & aviation metrics)
│   ├── db-api.js                # Dual-mode API bridge (SQLite backend ⇄ LocalStorage)
│   ├── data.js                  # Indian airspace dataset with capacity & load %
│   └── app.js                   # UI controller, 3-tier flow simulator, multi-lang tabs
├── backend/
│   ├── db_manager.py            # SQLite database initializer and CRUD queries
│   └── prims_solver.py          # Python Prim's solver with delay/fuel calculations
└── database/
    ├── schema.sql               # SQL DDL (Airports, Routes, Flights, MST Runs)
    ├── seed_data.sql            # Seed data for 16 Indian airports & 29 corridors
    ├── airtraffic.db            # SQLite database file
    └── java_integration_kit/    # Full Java JDBC & Hibernate integration kit
        ├── pom.xml              # Maven dependencies
        ├── hibernate.cfg.xml    # Hibernate configuration file
        ├── README.md            # Step-by-step Java lab guide
        └── src/
            ├── FullStackDemonstrator.java # Runnable Java 3-tier demonstrator
            ├── entity/          # JPA / Hibernate entities
            ├── dao/             # Pure JDBC and Hibernate DAOs
            └── util/            # Connection and SessionFactory utilities
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - feel free to use, modify, and distribute for academic and personal projects.
