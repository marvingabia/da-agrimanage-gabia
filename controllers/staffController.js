/*
    DA AgriManage - Staff Controller
    Handles staff-specific operations
*/

import { Inventory } from "../models/Inventory.js";
import { Announcement } from "../models/Announcement.js";
import { Claim } from "../models/Claim.js";
import { DamageReport } from "../models/DamageReport.js";
import { Insurance } from "../models/Insurance.js";

// Get inventory items (staff can view all)
export const getInventory = async (req, res) => {
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

// Get announcements
export const getAnnouncements = async (req, res) => {
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

// Get claims (staff can view but not modify status)
export const getClaims = async (req, res) => {
    try {
        const claims = await Claim.findAll();
        res.json({ claims });
    } catch (error) {
        console.error('Error getting claims:', error);
        res.status(500).json({ error: 'Failed to load claims' });
    }
};

// Get damage reports (staff can view but not modify status)
export const getDamageReports = async (req, res) => {
    try {
        const damageReports = await DamageReport.findAll();
        res.json({ damageReports });
    } catch (error) {
        console.error('Error getting damage reports:', error);
        res.status(500).json({ error: 'Failed to load damage reports' });
    }
};

// Get insurance applications (staff can view but not modify status)
export const getInsurance = async (req, res) => {
    try {
        const insurance = await Insurance.findAll();
        res.json({ insurance });
    } catch (error) {
        console.error('Error getting insurance applications:', error);
        res.status(500).json({ error: 'Failed to load insurance applications' });
    }
};