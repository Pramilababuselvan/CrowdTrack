-- ========================================================
-- Public Transport Crowd Predictor (CrowdTrack)
-- Database Schema Script for MySQL 8.0
-- ========================================================

CREATE DATABASE IF NOT EXISTS crowdtrack;
USE crowdtrack;

-- 1. Buses Table
CREATE TABLE IF NOT EXISTS buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL UNIQUE,
    route VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    current_passengers INT NOT NULL DEFAULT 0,
    peak_hour BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Reports Table
CREATE TABLE IF NOT EXISTS user_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    crowd_level VARCHAR(30) NOT NULL,
    passenger_count INT,
    comment VARCHAR(500),
    reporter_name VARCHAR(100) DEFAULT 'Anonymous Commuter',
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 3. Predictions Table (Audit & History)
CREATE TABLE IF NOT EXISTS predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bus_id BIGINT NOT NULL,
    occupancy_percentage DOUBLE NOT NULL,
    crowd_level VARCHAR(30) NOT NULL,
    report_score DOUBLE,
    explanation VARCHAR(1000),
    prediction_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prediction_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 4. Users Table (System Roles)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- --------------------------------------------------------
-- Sample Initial Data Seeding
-- --------------------------------------------------------
INSERT IGNORE INTO users (id, email, password, name, role) VALUES
(1, 'admin@transport.com', 'admin123', 'Transport Admin', 'ADMIN'),
(2, 'operator@transport.com', 'operator123', 'Fleet Operator', 'OPERATOR'),
(3, 'passenger@transport.com', 'passenger123', 'Regular Commuter', 'PASSENGER');

INSERT IGNORE INTO buses (id, bus_number, route, capacity, current_passengers, peak_hour) VALUES
(1, '101', 'Tambaram - CIT', 60, 48, TRUE),
(2, '102', 'Chennai Central - CIT', 60, 25, FALSE),
(3, '103', 'Guindy - CIT', 60, 40, FALSE),
(4, '104', 'Saidapet - CIT', 50, 53, TRUE),
(5, '105', 'T. Nagar - CIT', 55, 45, TRUE),
(6, '106', 'Koyambedu - CIT', 60, 32, FALSE);

INSERT IGNORE INTO user_reports (id, bus_id, crowd_level, passenger_count, comment, reporter_name) VALUES
(1, 1, 'HIGH', 49, 'Bus is getting very packed at Chromepet stop', 'Ravi K.'),
(2, 1, 'HIGH', 50, 'Only 2 seats left, rest standing', 'Priya S.'),
(3, 4, 'OVERCROWDED', 54, 'People standing on footboard!', 'Karthik R.');
