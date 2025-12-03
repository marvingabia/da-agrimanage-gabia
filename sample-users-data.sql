-- ============================================
-- Sample Users Data for Testing
-- DA-AgriManage System
-- ============================================

USE da_agrimanage;

-- ============================================
-- INSERT SAMPLE FARMERS
-- ============================================

-- Farmer 1: Juan Dela Cruz
INSERT INTO users (id, name, email, password, role, barangay, phone, landArea, landType, authProvider, isApproved, status, createdAt)
VALUES (
    'farmer-1732454001-juan',
    'Juan Dela Cruz',
    'juan@farmer.com',
    'Farmer123',
    'farmer',
    'Nasukob',
    '09123456789',
    2.5,
    'Rice Field',
    'email',
    TRUE,
    'active',
    NOW()
);

-- Farmer 2: Maria Santos
INSERT INTO users (id, name, email, password, role, barangay, phone, landArea, landType, authProvider, isApproved, status, createdAt)
VALUES (
    'farmer-1732454002-maria',
    'Maria Santos',
    'maria@farmer.com',
    'Farmer123',
    'farmer',
    'Poblacion',
    '09234567890',
    3.0,
    'Corn Field',
    'email',
    TRUE,
    'active',
    NOW()
);

-- Farmer 3: Pedro Reyes
INSERT INTO users (id, name, email, password, role, barangay, phone, landArea, landType, authProvider, isApproved, status, createdAt)
VALUES (
    'farmer-1732454003-pedro',
    'Pedro Reyes',
    'pedro@farmer.com',
    'Farmer123',
    'farmer',
    'Balatasan',
    '09345678901',
    1.5,
    'Vegetable Farm',
    'email',
    TRUE,
    'active',
    NOW()
);

-- Farmer 4: Ana Garcia
INSERT INTO users (id, name, email, password, role, barangay, phone, landArea, landType, authProvider, isApproved, status, createdAt)
VALUES (
    'farmer-1732454004-ana',
    'Ana Garcia',
    'ana@farmer.com',
    'Farmer123',
    'farmer',
    'Benli',
    '09456789012',
    2.0,
    'Rice Field',
    'email',
    TRUE,
    'active',
    NOW()
);

-- Farmer 5: Roberto Cruz
INSERT INTO users (id, name, email, password, role, barangay, phone, landArea, landType, authProvider, isApproved, status, createdAt)
VALUES (
    'farmer-1732454005-roberto',
    'Roberto Cruz',
    'roberto@farmer.com',
    'Farmer123',
    'farmer',
    'Cabugao',
    '09567890123',
    4.0,
    'Mixed Crops',
    'email',
    TRUE,
    'active',
    NOW()
);

-- ============================================
-- INSERT SAMPLE STAFF
-- ============================================

-- Staff 1: Default Staff (Already exists, but update if needed)
INSERT INTO users (id, name, email, password, role, barangay, phone, authProvider, isApproved, status, createdAt)
VALUES (
    'staff-default-user',
    'Staff Member',
    'staff@gmail.com',
    'Staff2025',
    'staff',
    'Poblacion',
    '09111111111',
    'email',
    TRUE,
    'active',
    NOW()
)
ON DUPLICATE KEY UPDATE 
    name = 'Staff Member',
    isApproved = TRUE,
    status = 'active';

-- Staff 2: Jane Smith
INSERT INTO users (id, name, email, password, role, barangay, phone, authProvider, isApproved, status, createdAt)
VALUES (
    'staff-1732454101-jane',
    'Jane Smith',
    'jane@staff.com',
    'Staff123',
    'staff',
    'Poblacion',
    '09222222222',
    'email',
    TRUE,
    'active',
    NOW()
);

-- Staff 3: Mark Johnson
INSERT INTO users (id, name, email, password, role, barangay, phone, authProvider, isApproved, status, createdAt)
VALUES (
    'staff-1732454102-mark',
    'Mark Johnson',
    'mark@staff.com',
    'Staff123',
    'staff',
    'Nasukob',
    '09333333333',
    'email',
    TRUE,
    'active',
    NOW()
);

-- ============================================
-- UPDATE ADMIN (Make sure admin exists)
-- ============================================

INSERT INTO users (id, name, email, password, role, barangay, phone, authProvider, isApproved, status, createdAt)
VALUES (
    'admin-default-user',
    'System Administrator',
    'admin@gmail.com',
    'Admin2025',
    'admin',
    'Main Office',
    '09999999999',
    'email',
    TRUE,
    'active',
    NOW()
)
ON DUPLICATE KEY UPDATE 
    name = 'System Administrator',
    isApproved = TRUE,
    status = 'active';

-- ============================================
-- VERIFY INSERTED DATA
-- ============================================

-- Show all users
SELECT 
    id,
    name,
    email,
    role,
    barangay,
    phone,
    isApproved,
    status,
    createdAt
FROM users
ORDER BY role, name;

-- Count by role
SELECT 
    role,
    COUNT(*) as total,
    SUM(CASE WHEN isApproved = TRUE THEN 1 ELSE 0 END) as approved
FROM users
GROUP BY role;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

SELECT 'Sample users created successfully!' AS Status;
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'farmer') AS total_farmers,
    (SELECT COUNT(*) FROM users WHERE role = 'staff') AS total_staff,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') AS total_admins;
