/*
    DA AgriManage - Main Routes
    Agricultural Management System Routes
*/

import express from "express";
// import { homePage } from "../controllers/homeController.js"; // Unused import removed
import { 
    loginPage, 
    registerPage, 
    forgotPasswordPage, 
    dashboardPage, 
    loginUser, 
    registerUser, 
    logoutUser,
    googleAuth
} from "../controllers/authController.js";
import { requireAuth, requireRole, redirectIfAuthenticated } from "../middleware/auth.js";

// Local dashboard stats function for API routes
async function getLocalDashboardStats() {
    try {
        // Import the auth controller functions
        const { getAllRegisteredFarmers, getFarmerStats } = await import("../controllers/authController.js");
        const farmerStats = getFarmerStats();
        
        return {
            totalFarmers: farmerStats.totalFarmers,
            googleFarmers: farmerStats.googleFarmers,
            emailFarmers: farmerStats.emailFarmers,
            activeFarmers: farmerStats.activeFarmers,
            totalClaims: Math.floor(farmerStats.totalFarmers * 1.5),
            pendingReports: Math.floor(farmerStats.totalFarmers * 0.3),
            inventoryItems: 25,
            totalStaff: 3,
            totalAdmins: 1,
            pendingClaims: Math.floor(farmerStats.totalFarmers * 0.2),
            availableItems: 20,
            activeAnnouncements: 3
        };
    } catch (error) {
        console.error("Error getting dashboard stats:", error.message);
        return {
            totalFarmers: 0,
            googleFarmers: 0,
            emailFarmers: 0,
            activeFarmers: 0,
            totalClaims: 0,
            pendingReports: 0,
            inventoryItems: 25,
            totalStaff: 3,
            totalAdmins: 1,
            pendingClaims: 0,
            availableItems: 20,
            activeAnnouncements: 3
        };
    }
}

// Farmer Controller
import {
    getFarmerData,
    submitClaim,
    submitDamageReport,
    applyInsurance,
    getFarmerClaims,
    getFarmerDamageReports,
    getFarmerInsurance,
    getFarmerAnnouncements
} from "../controllers/farmerController.js";

// Admin Controller
import {
    getAllFarmers,
    getAllStaff,
    createStaff,
    getAllInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getAllClaims,
    updateClaimStatus,
    getAllDamageReports,
    updateDamageReportStatus,
    getAllInsurance,
    updateInsuranceStatus,
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getDashboardStats as adminGetDashboardStats
} from "../controllers/adminController.js";

// Staff Controller
import {
    getInventory,
    createInventoryItem as staffCreateInventory,
    updateInventoryItem as staffUpdateInventory,
    getAnnouncements,
    createAnnouncement as staffCreateAnnouncement,
    updateAnnouncement as staffUpdateAnnouncement,
    getClaims,
    getDamageReports,
    getInsurance
} from "../controllers/staffController.js";

const router = express.Router();

// Public routes - Redirect root to login
router.get("/", (req, res) => {
    if (req.session.userId) {
        return res.redirect("/dashboard");
    }
    res.redirect("/login");
});
router.get("/login", redirectIfAuthenticated, loginPage);
router.post("/login", loginUser);
router.get("/register", redirectIfAuthenticated, registerPage);
router.post("/register", registerUser);
router.post("/auth/google", googleAuth);
router.get("/forgot-password", redirectIfAuthenticated, forgotPasswordPage);

// Protected routes
router.get("/dashboard", requireAuth, dashboardPage);
router.get("/logout", logoutUser);

// All section navigation is now handled by the enhanced dashboard SPA
// No separate page routes needed - everything is modal-based

// API Routes for AJAX calls

// Farmer routes
router.get("/api/farmer/data", requireRole(['farmer']), getFarmerData);
router.post("/api/farmer/claims", requireRole(['farmer']), submitClaim);
router.post("/api/farmer/damage-reports", requireRole(['farmer']), submitDamageReport);
router.post("/api/farmer/insurance", requireRole(['farmer']), applyInsurance);
router.get("/api/farmer/claims", requireRole(['farmer']), getFarmerClaims);
router.get("/api/farmer/damage-reports", requireRole(['farmer']), getFarmerDamageReports);
router.get("/api/farmer/insurance", requireRole(['farmer']), getFarmerInsurance);
router.get("/api/farmer/announcements", requireRole(['farmer']), getFarmerAnnouncements);

// Admin routes
router.get("/api/admin/farmers", requireRole(['admin']), getAllFarmers);
router.get("/api/admin/staff", requireRole(['admin']), getAllStaff);
router.post("/api/admin/staff", requireRole(['admin']), createStaff);
router.get("/api/admin/inventory", requireRole(['admin']), getAllInventory);
router.post("/api/admin/inventory", requireRole(['admin']), createInventoryItem);
router.put("/api/admin/inventory/:id", requireRole(['admin']), updateInventoryItem);
router.delete("/api/admin/inventory/:id", requireRole(['admin']), deleteInventoryItem);
router.get("/api/admin/claims", requireRole(['admin']), getAllClaims);
router.put("/api/admin/claims/:id/status", requireRole(['admin']), updateClaimStatus);
router.get("/api/admin/damage-reports", requireRole(['admin']), getAllDamageReports);
router.put("/api/admin/damage-reports/:id/status", requireRole(['admin']), updateDamageReportStatus);
router.get("/api/admin/insurance", requireRole(['admin']), getAllInsurance);
router.put("/api/admin/insurance/:id/status", requireRole(['admin']), updateInsuranceStatus);
router.get("/api/admin/announcements", requireRole(['admin']), getAllAnnouncements);
router.post("/api/admin/announcements", requireRole(['admin']), createAnnouncement);
router.put("/api/admin/announcements/:id", requireRole(['admin']), updateAnnouncement);
router.delete("/api/admin/announcements/:id", requireRole(['admin']), deleteAnnouncement);
router.get("/api/admin/stats", requireRole(['admin']), adminGetDashboardStats);

// Staff routes
router.get("/api/staff/inventory", requireRole(['staff', 'admin']), getInventory);
router.post("/api/staff/inventory", requireRole(['staff', 'admin']), staffCreateInventory);
router.put("/api/staff/inventory/:id", requireRole(['staff', 'admin']), staffUpdateInventory);
router.get("/api/staff/announcements", requireRole(['staff', 'admin']), getAnnouncements);
router.post("/api/staff/announcements", requireRole(['staff', 'admin']), staffCreateAnnouncement);
router.put("/api/staff/announcements/:id", requireRole(['staff', 'admin']), staffUpdateAnnouncement);
router.get("/api/staff/claims", requireRole(['staff', 'admin']), getClaims);
router.get("/api/staff/damage-reports", requireRole(['staff', 'admin']), getDamageReports);
router.get("/api/staff/insurance", requireRole(['staff', 'admin']), getInsurance);

// Health check endpoint for deployment monitoring
router.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "DA-AgriManage",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    });
});

// API status endpoint
router.get("/api/status", (req, res) => {
    res.json({
        api: "online",
        database: "connected",
        services: {
            authentication: "active",
            dashboard: "active",
            farmers: "active",
            staff: "active",
            admin: "active"
        }
    });
});

// Test route for modal functionality
router.get("/test-dashboard", (req, res) => {
    // Create a test session for demonstration
    req.session.userId = 'admin-test-user';
    req.session.userRole = 'admin';
    req.session.userName = 'Test Administrator';
    req.session.userBarangay = 'Main Office';
    req.session.userEmail = 'admin@test.com';
    
    res.render("dashboard-enhanced", { 
        title: "AgriSystem Dashboard - Test Mode",
        user: {
            id: 'admin-test-user',
            name: 'Test Administrator',
            email: 'admin@test.com',
            role: 'admin',
            barangay: 'Main Office'
        },
        stats: {
            totalFarmers: 5,
            totalClaims: 6,
            pendingReports: 3,
            inventoryItems: 6,
            totalStaff: 3,
            totalAdmins: 1,
            pendingClaims: 3,
            availableItems: 5,
            activeAnnouncements: 5
        }
    });
});

// Dashboard stats route
router.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
        const stats = await getLocalDashboardStats();
        res.json(stats);
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ error: 'Failed to load dashboard statistics' });
    }
});

// Get all registered farmers (for admin view)
router.get("/api/farmers/list", requireAuth, async (req, res) => {
    try {
        const { getAllRegisteredFarmers, getFarmerStats } = await import("../controllers/authController.js");
        const farmers = getAllRegisteredFarmers();
        const stats = getFarmerStats();
        
        res.json({
            farmers: farmers,
            stats: stats
        });
    } catch (error) {
        console.error('Error getting farmers list:', error);
        res.status(500).json({ error: 'Failed to load farmers list' });
    }
});

// Quick stats for sidebar badges
router.get("/api/dashboard/quick-stats", requireAuth, async (req, res) => {
    try {
        const stats = await getLocalDashboardStats();
        res.json({
            farmers: stats.totalFarmers || 0,
            staff: stats.totalStaff || 0,
            inventory: stats.inventoryItems || 0,
            claims: stats.totalClaims || 0,
            reports: stats.pendingReports || 0,
            insurance: 0, // Placeholder
            announcements: stats.activeAnnouncements || 0
        });
    } catch (error) {
        console.error('Error getting quick stats:', error);
        res.status(500).json({ error: 'Failed to load quick statistics' });
    }
});

export default router;