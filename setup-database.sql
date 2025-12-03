-- ============================================
-- DA-AgriManage Database Setup for Laragon
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS da_agrimanage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE da_agrimanage;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('farmer', 'staff', 'admin') NOT NULL DEFAULT 'farmer',
    barangay VARCHAR(100),
    phone VARCHAR(20),
    landArea DECIMAL(10,2),
    landType VARCHAR(100),
    authProvider VARCHAR(50) DEFAULT 'email',
    googleId VARCHAR(255),
    profilePicture TEXT,
    isApproved BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. INSURANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS insurance (
    id VARCHAR(100) PRIMARY KEY,
    farmerId VARCHAR(100) NOT NULL,
    farmerName VARCHAR(255) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    contactNumber VARCHAR(20),
    farmLocation VARCHAR(255),
    cropType VARCHAR(100) NOT NULL,
    cropVariety VARCHAR(100),
    insuredArea DECIMAL(10,2) NOT NULL,
    totalFarmArea DECIMAL(10,2),
    plantingDate DATE NOT NULL,
    expectedHarvestDate DATE NOT NULL,
    insuranceType VARCHAR(100) NOT NULL,
    coveragePeriod VARCHAR(100),
    premiumAmount DECIMAL(10,2) DEFAULT 0,
    coverageAmount DECIMAL(10,2) DEFAULT 0,
    previousYield INT,
    farmingExperience INT,
    additionalInfo TEXT,
    emergencyContact VARCHAR(20),
    status ENUM('pending', 'approved', 'rejected', 'active', 'expired') DEFAULT 'pending',
    approvedBy VARCHAR(100),
    approvedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmerId),
    INDEX idx_status (status),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. DAMAGE REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS damage_reports (
    id VARCHAR(100) PRIMARY KEY,
    farmerId VARCHAR(100) NOT NULL,
    farmerName VARCHAR(255) NOT NULL,
    contactNumber VARCHAR(20),
    barangay VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    incidentDate DATE NOT NULL,
    disasterType VARCHAR(100) NOT NULL,
    cropType VARCHAR(100) NOT NULL,
    cropStage VARCHAR(100),
    affectedArea DECIMAL(10,2) NOT NULL,
    damagePercentage INT NOT NULL,
    estimatedLoss DECIMAL(10,2),
    damageDescription TEXT,
    additionalNotes TEXT,
    status ENUM('pending', 'verified', 'rejected', 'processed') DEFAULT 'pending',
    verificationNotes TEXT,
    verifiedBy VARCHAR(100),
    verifiedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmerId),
    INDEX idx_status (status),
    INDEX idx_barangay (barangay),
    INDEX idx_incident_date (incidentDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. REQUEST LETTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS request_letters (
    id VARCHAR(100) PRIMARY KEY,
    farmerId VARCHAR(100) NOT NULL,
    farmerName VARCHAR(255) NOT NULL,
    farmerEmail VARCHAR(255),
    barangay VARCHAR(100) NOT NULL,
    requestType VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    contactNumber VARCHAR(20),
    status ENUM('pending', 'approved', 'rejected', 'responded') DEFAULT 'pending',
    response TEXT,
    actionTaken TEXT,
    respondedBy VARCHAR(100),
    respondedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmerId),
    INDEX idx_status (status),
    INDEX idx_barangay (barangay),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. CLAIMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(100) PRIMARY KEY,
    farmerId VARCHAR(100) NOT NULL,
    farmerName VARCHAR(255) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    claimType VARCHAR(100) NOT NULL,
    itemRequested VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected', 'distributed') DEFAULT 'pending',
    approvedBy VARCHAR(100),
    approvedAt TIMESTAMP NULL,
    distributedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmerId),
    INDEX idx_status (status),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. INVENTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(100) PRIMARY KEY,
    itemName VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    variety VARCHAR(100),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    reorderLevel DECIMAL(10,2) DEFAULT 0,
    unitCost DECIMAL(10,2) DEFAULT 0,
    totalValue DECIMAL(12,2) DEFAULT 0,
    location VARCHAR(255),
    barangay VARCHAR(100),
    supplier VARCHAR(255),
    description TEXT,
    notes TEXT,
    status ENUM('available', 'low_stock', 'out_of_stock', 'reserved') DEFAULT 'available',
    createdBy VARCHAR(100),
    createdByName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_location (location),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    eventDate DATE,
    eventTime TIME,
    venue VARCHAR(255),
    targetBarangays JSON,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('active', 'archived', 'draft') DEFAULT 'active',
    createdBy VARCHAR(100),
    createdByName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_event_date (eventDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. BENEFITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS benefits (
    id VARCHAR(100) PRIMARY KEY,
    farmerId VARCHAR(100) NOT NULL,
    farmerName VARCHAR(255) NOT NULL,
    farmerEmail VARCHAR(255),
    barangay VARCHAR(100) NOT NULL,
    benefitType VARCHAR(100) NOT NULL,
    itemName VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    reason TEXT,
    status ENUM('for_claim', 'claimed', 'expired') DEFAULT 'for_claim',
    claimedAt TIMESTAMP NULL,
    expiresAt TIMESTAMP NULL,
    createdBy VARCHAR(100),
    createdByName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmerId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_farmer (farmerId),
    INDEX idx_status (status),
    INDEX idx_barangay (barangay)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notificationType VARCHAR(50) NOT NULL,
    recipientType VARCHAR(50) NOT NULL,
    barangay VARCHAR(100),
    totalRecipients INT DEFAULT 0,
    emailSent INT DEFAULT 0,
    smsSent INT DEFAULT 0,
    failed INT DEFAULT 0,
    status ENUM('sent', 'failed', 'partial') DEFAULT 'sent',
    sentBy VARCHAR(100),
    sentByName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (notificationType),
    INDEX idx_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT ADMIN USER
-- ============================================
INSERT INTO users (id, name, email, password, role, barangay, isApproved, status, createdAt)
VALUES (
    'admin-default-user',
    'System Administrator',
    'admin@gmail.com',
    'Admin2025',
    'admin',
    'Main Office',
    TRUE,
    'active',
    NOW()
) ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- ============================================
-- INSERT SAMPLE STAFF USER
-- ============================================
INSERT INTO users (id, name, email, password, role, barangay, isApproved, status, createdAt)
VALUES (
    'staff-default-user',
    'Staff Member',
    'staff@gmail.com',
    'Staff2025',
    'staff',
    'Poblacion',
    TRUE,
    'active',
    NOW()
) ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- ============================================
-- SHOW TABLES
-- ============================================
SHOW TABLES;

-- ============================================
-- SHOW TABLE STRUCTURES
-- ============================================
DESCRIBE users;
DESCRIBE insurance;
DESCRIBE damage_reports;
DESCRIBE request_letters;
DESCRIBE claims;
DESCRIBE inventory;
DESCRIBE announcements;
DESCRIBE benefits;
DESCRIBE notifications;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS TotalTables FROM information_schema.tables WHERE table_schema = 'da_agrimanage';
