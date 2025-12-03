/*
    DA AgriManage - Staff Controller
    Handles staff-specific operations
*/

// Import MySQL models
const mysqlModels = await Promise.all([
    import("../models/InventoryMySQL.js"),
    import("../models/AnnouncementMySQL.js"),
    import("../models/ClaimMySQL.js"),
    import("../models/DamageReportMySQL.js"),
    import("../models/InsuranceMySQL.js"),
    import("../models/RequestLetterMySQL.js")
]);

const Inventory = mysqlModels[0].Inventory || mysqlModels[0].default;
const Announcement = mysqlModels[1].Announcement || mysqlModels[1].default;
const Claim = mysqlModels[2].Claim || mysqlModels[2].default;
const DamageReport = mysqlModels[3].DamageReport || mysqlModels[3].default;
const Insurance = mysqlModels[4].Insurance || mysqlModels[4].default;
const RequestLetter = mysqlModels[5].RequestLetter || mysqlModels[5].default;

console.log('✅ Using MySQL models for staff operations');

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

// Create Claim
export const createClaim = async (req, res) => {
    try {
        const { farmerId, farmerName, claimType, itemRequested, quantity, unit, reason, barangay } = req.body;
        const claim = new Claim({
            farmerId, farmerName, claimType, itemRequested, quantity: parseFloat(quantity), unit, reason, barangay, status: 'pending'
        });
        await claim.save();
        res.json({ success: true, message: 'Claim created successfully', claim });
    } catch (error) {
        console.error('Error creating claim:', error);
        res.status(500).json({ error: 'Failed to create claim' });
    }
};

// Update Claim
export const updateClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { claimType, itemRequested, quantity, unit, reason, status } = req.body;
        const claim = await Claim.findById(id);
        if (!claim) return res.status(404).json({ error: 'Claim not found' });
        claim.claimType = claimType; claim.itemRequested = itemRequested; claim.quantity = parseFloat(quantity); claim.unit = unit; claim.reason = reason; claim.status = status;
        await claim.save();
        res.json({ success: true, message: 'Claim updated successfully', claim });
    } catch (error) {
        console.error('Error updating claim:', error);
        res.status(500).json({ error: 'Failed to update claim' });
    }
};

// Delete Claim
export const deleteClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const claim = await Claim.findById(id);
        if (!claim) return res.status(404).json({ error: 'Claim not found' });
        await claim.delete();
        res.json({ success: true, message: 'Claim deleted successfully' });
    } catch (error) {
        console.error('Error deleting claim:', error);
        res.status(500).json({ error: 'Failed to delete claim' });
    }
};

// Create Damage Report
export const createDamageReport = async (req, res) => {
    try {
        const { farmerId, farmerName, barangay, calamityType, incidentDate, affectedCrop, affectedArea, damagePercentage, description } = req.body;
        const damageReport = new DamageReport({
            farmerId, farmerName, barangay, calamityType, incidentDate: new Date(incidentDate), affectedCrop, affectedArea: parseFloat(affectedArea), damagePercentage: parseFloat(damagePercentage), description, status: 'submitted'
        });
        await damageReport.save();
        res.json({ success: true, message: 'Damage report created successfully', damageReport });
    } catch (error) {
        console.error('Error creating damage report:', error);
        res.status(500).json({ error: 'Failed to create damage report' });
    }
};

// Update Damage Report
export const updateDamageReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { calamityType, incidentDate, affectedCrop, affectedArea, damagePercentage, description, status } = req.body;
        const damageReport = await DamageReport.findById(id);
        if (!damageReport) return res.status(404).json({ error: 'Damage report not found' });
        damageReport.calamityType = calamityType; damageReport.incidentDate = new Date(incidentDate); damageReport.affectedCrop = affectedCrop; damageReport.affectedArea = parseFloat(affectedArea); damageReport.damagePercentage = parseFloat(damagePercentage); damageReport.description = description; damageReport.status = status;
        await damageReport.save();
        res.json({ success: true, message: 'Damage report updated successfully', damageReport });
    } catch (error) {
        console.error('Error updating damage report:', error);
        res.status(500).json({ error: 'Failed to update damage report' });
    }
};

// Delete Damage Report
export const deleteDamageReport = async (req, res) => {
    try {
        const { id } = req.params;
        const damageReport = await DamageReport.findById(id);
        if (!damageReport) return res.status(404).json({ error: 'Damage report not found' });
        await damageReport.delete();
        res.json({ success: true, message: 'Damage report deleted successfully' });
    } catch (error) {
        console.error('Error deleting damage report:', error);
        res.status(500).json({ error: 'Failed to delete damage report' });
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

// Get real-time notifications for staff
export const getStaffNotifications = async (req, res) => {
    try {
        const notifications = global.staffNotifications || [];
        
        // Get counts
        const newDamageReports = notifications.filter(n => n.type === 'new_damage_report').length;
        const newRequestLetters = notifications.filter(n => n.type === 'new_request_letter').length;
        
        res.json({
            success: true,
            notifications: notifications,
            counts: {
                damageReports: newDamageReports,
                requestLetters: newRequestLetters,
                total: notifications.length
            }
        });
    } catch (error) {
        console.error('Error getting staff notifications:', error);
        res.status(500).json({ error: 'Failed to load notifications' });
    }
};

// Clear staff notifications
export const clearStaffNotifications = async (req, res) => {
    try {
        global.staffNotifications = [];
        res.json({
            success: true,
            message: 'Notifications cleared'
        });
    } catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ error: 'Failed to clear notifications' });
    }
};

// Create Insurance
export const createInsurance = async (req, res) => {
    try {
        const { farmerId, farmerName, barangay, cropType, insuredArea, plantingDate, expectedHarvestDate, insuranceType } = req.body;
        const insurance = new Insurance({
            farmerId, farmerName, barangay, cropType, insuredArea: parseFloat(insuredArea), plantingDate: new Date(plantingDate), expectedHarvestDate: new Date(expectedHarvestDate), insuranceType, premiumAmount: 0, coverageAmount: 0, status: 'pending'
        });
        // TODO: Calculate premium and coverage
        await insurance.save();
        res.json({ success: true, message: 'Insurance created successfully', insurance });
    } catch (error) {
        console.error('Error creating insurance:', error);
        res.status(500).json({ error: 'Failed to create insurance' });
    }
};

// Update Insurance
export const updateInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const { cropType, insuredArea, plantingDate, expectedHarvestDate, insuranceType, status } = req.body;
        const insurance = await Insurance.findById(id);
        if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
        insurance.cropType = cropType; insurance.insuredArea = parseFloat(insuredArea); insurance.plantingDate = new Date(plantingDate); insurance.expectedHarvestDate = new Date(expectedHarvestDate); insurance.insuranceType = insuranceType; insurance.status = status;
        // TODO: Recalculate premium and coverage if insuredArea or insuranceType changes
        await insurance.save();
        res.json({ success: true, message: 'Insurance updated successfully', insurance });
    } catch (error) {
        console.error('Error updating insurance:', error);
        res.status(500).json({ error: 'Failed to update insurance' });
    }
};

// Delete Insurance
export const deleteInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const insurance = await Insurance.findById(id);
        if (!insurance) return res.status(404).json({ error: 'Insurance not found' });
        await insurance.delete();
        res.json({ success: true, message: 'Insurance deleted successfully' });
    } catch (error) {
        console.error('Error deleting insurance:', error);
        res.status(500).json({ error: 'Failed to delete insurance' });
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


// Get all request letters (Staff view)
export const getAllRequests = async (req, res) => {
    try {
        const requests = await RequestLetter.findAll();
        
        res.json({
            success: true,
            requests: requests || []
        });
    } catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({ error: 'Failed to load requests' });
    }
};

// Get pending requests
export const getPendingRequests = async (req, res) => {
    try {
        const requests = await RequestLetter.findByStatus('pending');
        
        res.json({
            success: true,
            requests: requests || []
        });
    } catch (error) {
        console.error('Error getting pending requests:', error);
        res.status(500).json({ error: 'Failed to load pending requests' });
    }
};

// Update request letter (Staff CRUD)
export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const request = await RequestLetter.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        // Update fields
        Object.assign(request, updates);
        await request.save();
        
        res.json({
            success: true,
            message: 'Request updated successfully',
            request: request
        });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({ error: 'Failed to update request' });
    }
};

// Update request status and send announcement feedback
export const updateRequestStatusWithFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response, actionTaken } = req.body;
        const staffName = req.session.userName;
        
        const request = await RequestLetter.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        // Update request status
        request.status = status;
        request.response = response;
        request.actionTaken = actionTaken;
        request.respondedBy = staffName;
        request.respondedAt = new Date().toISOString();
        await request.save();
        
        res.json({
            success: true,
            message: `Request ${status} successfully`,
            request: request
        });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update request status' });
    }
};

// Delete request letter (Staff CRUD)
export const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const request = await RequestLetter.findById(id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        await request.delete();
        
        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Failed to delete request' });
    }
};

// Get request statistics
export const getRequestStats = async (req, res) => {
    try {
        const allRequests = await RequestLetter.findAll();
        
        const stats = {
            total: allRequests.length,
            pending: allRequests.filter(r => r.status === 'pending').length,
            approved: allRequests.filter(r => r.status === 'approved').length,
            rejected: allRequests.filter(r => r.status === 'rejected').length
        };
        
        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error getting request stats:', error);
        res.status(500).json({ error: 'Failed to load request statistics' });
    }
};
