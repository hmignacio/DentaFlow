CREATE DATABASE IF NOT EXISTS `dentaflow`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
  
USE `dentaflow`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `user_role` ENUM('patient', 'admin') NOT NULL DEFAULT 'patient',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB
  AUTO_INCREMENT=3
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` VARCHAR(128) NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `data` MEDIUMTEXT,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  
  
  COLLATE=utf8mb4_0900_ai_ci;
  
  

-- ==========================================
-- DENTAL SERVICES
-- ==========================================

CREATE TABLE IF NOT EXISTS dental_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==========================================
-- DENTISTS
-- ==========================================

CREATE TABLE IF NOT EXISTS dentists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==========================================
-- APPOINTMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,

    service_id INT NOT NULL,
    dentist_id INT NOT NULL,

    appointment_date DATE NOT NULL,
    appointment_time TIME NULL,

    status ENUM(
        'Pending',
        'Booked',
        'Completed',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',

    created_by INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES users(id),

    CONSTRAINT fk_appointment_service
        FOREIGN KEY (service_id)
        REFERENCES dental_services(id),

    CONSTRAINT fk_appointment_dentist
        FOREIGN KEY (dentist_id)
        REFERENCES dentists(id),

    CONSTRAINT fk_appointment_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id),

    INDEX idx_patient (patient_id),
    INDEX idx_dentist_schedule (dentist_id, appointment_date),
    INDEX idx_status (status)
);

-- Dental services
INSERT IGNORE INTO dental_services (service_name)
VALUES
('Tooth Extraction'),
('Root Canal'),
('Cleaning'),
('Tooth Restoration');

-- Dentists
INSERT INTO dentists (full_name)
SELECT 'Dra. Hanna Ignacio'
WHERE NOT EXISTS (
    SELECT 1 FROM dentists
    WHERE full_name = 'Dra. Hanna Ignacio'
);

INSERT INTO dentists (full_name)
SELECT 'Dr. Tovy Tongson'
WHERE NOT EXISTS (
    SELECT 1 FROM dentists
    WHERE full_name = 'Dr. Tovy Tongson'
);

INSERT INTO dentists (full_name)
SELECT 'Dr. Kurt Gozon'
WHERE NOT EXISTS (
    SELECT 1 FROM dentists
    WHERE full_name = 'Dr. Kurt Gozon'
);

INSERT INTO dentists (full_name)
SELECT 'Dra. Xyril Fabellon'
WHERE NOT EXISTS (
    SELECT 1 FROM dentists
    WHERE full_name = 'Dra. Xyril Fabellon'
);


ALTER TABLE appointments
ADD COLUMN booked_slot_key VARCHAR(50)
GENERATED ALWAYS AS (
  CASE
    WHEN status = 'Booked'
    THEN CONCAT(
      dentist_id, ':',
      DATE_FORMAT(appointment_date, '%Y-%m-%d'), ':',
      TIME_FORMAT(appointment_time, '%H:%i:%s')
    )
    ELSE NULL
  END
) STORED,
ADD UNIQUE KEY uq_booked_slot (booked_slot_key);


