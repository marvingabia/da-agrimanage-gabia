/*
    DA AgriManage - Admin Controller
    Handles admin-specific operations
*/

import { User } from "../models/User.js";
import { Inventory } from "../models/Inventory.js";
import { Claim } from "../models/Claim.js";
import { DamageReport } from "../models/DamageReport.js";
import { Insurance } from "../models/Insurance.js";
import { Announcement } from "../models/Announcement.js";

// Get all farmers
export const getAllFarmers = async (req, res) => {
    try {
        const farmers = await User.findByRole('farmer');
        res.json({ farmers });
    } catch (error) {
        console.error('Error getting farmers:', error);
        res.status(500).json({ error: 'Failed to load farmers' });
    }
};

// Get all staff
export const getAllStaff = async (req, res) => {
    try {
        const staff = await User.findByRole('staff');
        res.json({ staff });
    } catch (error) {
        console.error('Error getting staff:', error);
        res.status(500).json({ error: 'Failed to load staff' });
    }
};

// Create new staff member
export const createStaff = async (req, res) => {
    try {
        const { name, email, phone, barangay } = req.body;
        
        const staff = new User({
            name,
            email,
            phone,
            role: 'staff',
            barangay,
            status: 'active'
        });

        await staff.save();
        res.json({ success: true, message: 'Staff member created successfully', staff });
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ error: 'Failed to create staff member' });
    }
};

// Get all inventory items
export const getAllInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll();
        res.json({ inventory });
    } catch (error) {
        console.error('Error getting inventory:', error);
        res.status(500).json({ error: 'Failed to load inventory' });
    }
};

// Create inventory item
export const createInventoryItem = async (req, res) => {
    try {
        const { itemName, type, variety, quantity, unit, barangay, description } = req.body;
        
        const inventoryItem = new Inventory({
            itemName,
            type,
            variety,
            quantity: parseFloat(quantity),
            unit,
            barangay,
            description,
            createdBy: req.session.userId,
            status: 'available'
        });

        await inventoryItem.save();
        res.json({ success: true, message: 'Inventory item created successfully', inventoryItem });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
};

// Update inventory item
export const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, type, variety, quantity, unit, barangay, description, status } = req.body;
        
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        inventoryItem.itemName = itemName;
        inventoryItem.type = type;
        inventoryItem.variety = variety;
        inventoryItem.quantity = parseFloat(quantity);
        inventoryItem.unit = unit;
        inventoryItem.barangay = barangay;
        inventoryItem.description = description;
        inventoryItem.status = status;

        await inventoryItem.save();
        res.json({ success: true, message: 'Inventory item updated successfully', inventoryItem });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
};

// Delete inventory item
export const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const inventoryItem = await Inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        await inventoryItem.delete();
        res.json({ success: true, message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
};

// Get all claims
export const getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.findAll();
        res.json({ claims });
    } catch (error) {
        console.error('Error getting claims:', error);
        res.status(500).json({ error: 'Failed to load claims' });
    }
};

// Update claim status
export const updateClaimStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNotes } = req.body;
        
        const claim = await Claim.findById(id);
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        await claim.updateStatus(status, req.session.userId, reviewNotes);
        res.json({ success: true, message: 'Claim status updated successfully', claim });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({ error: 'Failed to update claim status' });
    }
};

// Get all damage reports
export const getAllDamageReports = async (req, res) => {
    try {
        const damageReports = await DamageReport.findAll();
        res.json({ damageReports });
    } catch (error) {
        console.error('Error getting damage reports:', error);
        res.status(500).json({ error: 'Failed to load damage reports' });
    }
};

// Update damage report status
export const updateDamageReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, verificationNotes } = req.body;
        
        const damageReport = await DamageReport.findById(id);
        if (!damageReport) {
            return res.status(404).json({ error: 'Damage report not found' });
        }

        await damageReport.updateStatus(status, req.session.userId, verificationNotes);
        res.json({ success: true, message: 'Damage report status updated successfully', damageReport });
    } catch (error) {
        console.error('Error updating damage report status:', error);
        res.status(500).json({ error: 'Failed to update damage report status' });
    }
};

// Get all insurance applications
export const getAllInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findAll();
        res.json({ insurance });
    } catch (error) {
        console.error('Error getting insurance applications:', error);
        res.status(500).json({ error: 'Failed to load insurance applications' });
    }
};

// Update insurance status
export const updateInsuranceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, approvalNotes } = req.body;
        
        const insurance = await Insurance.findById(id);
        if (!insurance) {
            return res.status(404).json({ error: 'Insurance application not found' });
        }

        let policyNumber = '';
        if (status === 'approved') {
            policyNumber = insurance.generatePolicyNumber();
        }

        await insurance.updateStatus(status, req.session.userId, approvalNotes, policyNumber);
        res.json({ success: true, message: 'Insurance status updated successfully', insurance });
    } catch (error) {
        console.error('Error updating insurance status:', error);
        res.status(500).json({ error: 'Failed to update insurance status' });
    }
};

// Get all announcements
export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.findAll();
        res.json({ announcements });
    } catch (error) {
        console.error('Error getting announcements:', error);
        res.status(500).json({ error: 'Failed to load announcements' });
    }
};

// Create announcement
export const createAnnouncement = async (req, res) => {
    try {
        const { title, message, type, eventDate, venue, targetBarangays, priority } = req.body;
        
        const announcement = new Announcement({
            title,
            message,
            type,
            eventDate: eventDate ? new Date(eventDate) : null,
            venue,
            targetBarangays: Array.isArray(targetBarangays) ? targetBarangays : [targetBarangays],
            priority,
            createdBy: req.session.userId,
            createdByName: req.session.userName,
            status: 'active'
        });

        await announcement.save();
        res.json({ success: true, message: 'Announcement created successfully', announcement });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ error: 'Failed to create announcement' });
    }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, type, eventDate, venue, targetBarangays, priority, status } = req.body;
        
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        announcement.title = title;
        announcement.message = message;
        announcement.type = type;
        announcement.eventDate = eventDate ? new Date(eventDate) : null;
        announcement.venue = venue;
        announcement.targetBarangays = Array.isArray(targetBarangays) ? targetBarangays : [targetBarangays];
        announcement.priority = priority;
        announcement.status = status;

        await announcement.save();
        res.json({ success: true, message: 'Announcement updated successfully', announcement });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ error: 'Failed to update announcement' });
    }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        await announcement.delete();
        res.json({ success: true, message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const [userStats, inventoryStats, claimStats, damageStats, insuranceStats, announcementStats] = await Promise.all([
            User.getStats(),
            Inventory.getStats(),
            Claim.getStats(),
            DamageReport.getStats(),
            Insurance.getStats(),
            Announcement.getStats()
        ]);

        res.json({
            users: userStats,
            inventory: inventoryStats,
            claims: claimStats,
            damage: damageStats,
            insurance: insuranceStats,
            announcements: announcementStats
        });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ error: 'Failed to load dashboard statistics' });
    }
};