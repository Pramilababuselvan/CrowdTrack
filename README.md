# Public Transport Crowd Predictor (CrowdTrack)

A full-stack, enterprise-grade public transport crowd prediction system built with **Spring Boot 3.3.4 (Java 21+)**, **MySQL 8.0**, and **React 18 (Vite)** using a **deterministic rule-based crowd prediction algorithm** — completely free of complex AI/ML models or external datasets.

---

## 1. Project Overview & Architecture

```text
                             COMMUTER / ADMIN
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │    React.js + Vite UI     │
                      │  Dashboard, Fleet, Reports│
                      └─────────────┬─────────────┘
                                    │  REST / JSON (Port 5173 -> 8080)
                                    ▼
                      ┌───────────────────────────┐
                      │    Spring Boot Backend    │
                      │  Controllers & Services   │
                      └─────────────┬─────────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
             ┌──────────────────────┐   ┌──────────────────────┐
             │ Rule-Based Predictor │   │  Spring Data JPA     │
             │   Decision Engine    │   │  Hibernate ORM       │
             └──────────────────────┘   └──────────┬───────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────────┐
                                        │    MySQL Database    │
                                        │  Buses, Reports, Log │
                                        └──────────────────────┘
```

### Key Highlights
- **100% Deterministic Rule-Based Algorithm**: Explainable, verifiable, and transparent arithmetic logic.
- **Zero AI / Zero ML Complexity**: No training datasets, no scikit-learn/TensorFlow dependencies, no Python runtime required.
- **Full-Stack REST Architecture**: Modular Spring Boot layered architecture (Controllers -> Services -> Repositories -> Entities) cleanly mapped to React front-end components.
- **Real-Time Recalculation**: Every submitted passenger crowd report immediately recalculates and persists the bus prediction in MySQL.

---

## 2. Rule-Based Crowd Prediction Engine

The system calculates crowd levels through a transparent 4-stage pipeline:

```text
Passenger Count & Capacity  ──▶  Occupancy Percentage
                                          │
                                          ▼
Peak-Hour Active Modifier   ──▶  Borderline Threshold Shifts
                                          │
                                          ▼
Weighted User Reports       ──▶  Community Crowd Elevation
                                          │
                                          ▼
                                FINAL CROWD PREDICTION
                          (LOW, MEDIUM, HIGH, OVERCROWDED)
```

### Base Classification Thresholds
$$\text{Occupancy \%} = \left(\frac{\text{Current Passengers}}{\text{Capacity}}\right) \times 100$$

| Occupancy % | Crowd Classification | Passenger Experience |
|:---:|:---:|:---|
| **0% – 49.9%** | 🟢 **LOW** | Ample seating available, comfortable commute. |
| **50% – 79.9%** | 🟡 **MEDIUM** | Most seats occupied, moderate standing room. |
| **80% – 100.0%** | 🟠 **HIGH** | Aisle heavily packed, boarding difficult. |
| **> 100.0%** | 🔴 **OVERCROWDED** | Exceeds safe capacity; footboard crowding. |

### Rule Modifiers
1. **Peak-Hour Sensitivity Modifier**:
   - If `peakHour == true` and Occupancy $\ge 40\%$ (borderline): Shifted from **LOW** $\to$ **MEDIUM**.
   - If `peakHour == true` and Occupancy $\ge 70\%$ (borderline): Shifted from **MEDIUM** $\to$ **HIGH**.
2. **Community Report Weighting**:
   - Commuter reports are scored: $\text{LOW}=0$, $\text{MEDIUM}=1$, $\text{HIGH}=2$, $\text{OVERCROWDED}=3$.
   - If the average score of recent reports is $\ge 2.2 / 3.0$, crowd is elevated to **HIGH** or **OVERCROWDED**.

---

## 3. Database Schema

The database `crowdtrack` contains 4 relational tables:

```text
  buses                        user_reports
┌─────────────────────────┐  ┌─────────────────────────┐
│ id (PK)                 │  │ id (PK)                 │
│ bus_number (VARCHAR)    │◀─┼─ bus_id (FK)            │
│ route (VARCHAR)         │  │ crowd_level (VARCHAR)   │
│ capacity (INT)          │  │ passenger_count (INT)   │
│ current_passengers (INT)│  │ comment (VARCHAR)       │
│ peak_hour (BOOLEAN)     │  │ reporter_name (VARCHAR) │
│ created_at (DATETIME)   │  │ reported_at (DATETIME)  │
└────────────┬────────────┘  └─────────────────────────┘
             │
             │                 predictions
             │               ┌─────────────────────────┐
             │               │ id (PK)                 │
             └──────────────┼─ bus_id (FK)            │
                             │ occupancy_pct (DOUBLE)  │
                             │ crowd_level (VARCHAR)   │
                             │ report_score (DOUBLE)   │
                             │ explanation (VARCHAR)   │
                             │ prediction_time (DATETIME)
                             └─────────────────────────┘
```

---

## 4. REST API Specification

### Bus Management (`/api/buses`)
- `GET /api/buses` — List all buses with live crowd status
- `GET /api/buses/{id}` — Get single bus details
- `POST /api/buses` — Add a new bus
- `PUT /api/buses/{id}` — Update bus route / capacity
- `PATCH /api/buses/{id}/passengers?count={n}&peak={bool}` — Quick passenger count update
- `DELETE /api/buses/{id}` — Remove bus

### Commuter Reports (`/api/reports`)
- `GET /api/reports` — Get recent commuter reports
- `GET /api/reports/bus/{busId}` — Get reports for specific bus
- `POST /api/reports` — Submit report and trigger auto-recalculation

### Predictions (`/api/predictions`)
- `GET /api/predictions` — Full prediction audit log
- `POST /api/predictions/{busId}` — Force prediction calculation and persist to MySQL
- `GET /api/predictions/live/{busId}` — On-demand live calculation without persisting

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard` — Aggregated statistics (total buses, crowd distribution, top crowded routes)

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate Admin / Fleet Operator / Passenger

---

## 5. How to Run the Application

### Prerequisites
- **Java 21 or higher** (`java -version`)
- **Node.js 18+ and npm** (`node -v`)
- **MySQL Server 8.0** running on `localhost:3306`

### Step 1: Configure MySQL (Optional / Default)
In `public-transport-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crowdtrack?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```
*(If your MySQL password is not `root`, simply replace it with your local MySQL password. Or run with `--spring.profiles.active=h2` for zero-setup instant in-memory mode!)*

### Step 2: Start Spring Boot Backend
Double-click `start-backend.bat` or run:
```powershell
cd public-transport-backend
mvn spring-boot:run
```
Backend will start at: `http://localhost:8080`
*(Pre-loaded with sample routes: Bus 101 Tambaram - CIT, Bus 102 Guindy - CIT, Bus 103 Saidapet - CIT, etc.)*

### Step 3: Start React Frontend
Double-click `start-frontend.bat` or run:
```powershell
cd public-transport-frontend
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### Step 4: Demo Credentials
- **Admin**: `admin@transport.com` / `admin123`
- **Operator**: `operator@transport.com` / `operator123`
- **Passenger**: `passenger@transport.com` / `passenger123`
*(Or click the 1-click Quick Demo buttons on the login screen)*
