/*
    DA AgriManage - CRUD Routes
    Handles all API endpoints for staff members.
*/
import express from 'express';
import { requireRole } from '../middleware/auth.js'; // Siguraduhing tama ang path sa auth middleware
import {
    // Inventory
    getInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,

    // Announcements
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    // Claims
    getClaims,
    createClaim,
    updateClaim,
    deleteClaim,

    // Damage Reports
    getDamageReports,
    createDamageReport,
    updateDamageReport,
    deleteDamageReport,

    // Insurance
    getInsurance,
    createInsurance,
    updateInsurance,
    deleteInsurance,

    // Request Letters
    getAllRequests,
    updateRequestStatusWithFeedback,
    deleteRequest
} from '../controllers/staffController.js';

const router = express.Router();

// Lahat ng routes dito ay para sa 'staff' role lang
router.use(requireRole(['staff']));

// Inventory CRUD
router.get('/inventory', getInventory);
router.post('/inventory', createInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);

// Announcements CRUD
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Claims CRUD
router.get('/claims', getClaims);
router.post('/claims', createClaim);
router.put('/claims/:id', updateClaim);
router.delete('/claims/:id', deleteClaim);

// Damage Reports CRUD
router.get('/damage-reports', getDamageReports);
router.post('/damage-reports', createDamageReport);
router.put('/damage-reports/:id', updateDamageReport);
router.delete('/damage-reports/:id', deleteDamageReport);

// Insurance CRUD
router.get('/insurance', getInsurance);
router.post('/insurance', createInsurance);
router.put('/insurance/:id', updateInsurance);
router.delete('/insurance/:id', deleteInsurance);

// Request Letter Management
router.get('/requests', getAllRequests);
router.put('/requests/:id/status', updateRequestStatusWithFeedback);
router.delete('/requests/:id', deleteRequest);

export default router;