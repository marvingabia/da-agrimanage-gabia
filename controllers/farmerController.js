/*
    DA AgriManage - Farmer Controller
    Handles farmer-specific operations
*/

import { User } from "../models/User.js";
import { Claim } from "../models/Claim.js";
import { DamageReport } from "../models/DamageReport.js";
import { Insurance } from "../models/Insurance.js";
import { Announcement } from "../models/Announcement.js";

// Get farmer dashboard data
export const getFarmerData = async (req, res) => {
    try {
        const farmerId = req.session.userId;
        const farmer = await User.findById(farmerId);
        
        if (!farmer || farmer.role !== 'farmer') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const [claims, damageReports, insurance, announcements] = await Promise.all([
            Claim.findByFarmer(farmerId),
            DamageReport.findByFarmer(farmerId),
            Insurance.findByFarmer(farmerId),
            Announcement.findByBarangay(farmer.barangay)
        ]);

        res.json({
            farmer,
            claims,
            damageReports,
            insurance,
            announcements
        });
    } catch (error) {
        console.error('Error getting farmer data:', error);
        res.status(500).json({ error: 'Failed to load farmer data' });
    }
};

// Submit a new claim
export const submitClaim = async (req, res) => {
    try {
        const { claimType, itemRequested, quantity, unit, reason } = req.body;
        const farmerId = req.session.userId;
        
        const farmer = await User.findById(farmerId);
        if (!farmer || farmer.role !== 'farmer') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const claim = new Claim({
            farmerId,
            farmerName: farmer.name,
            claimType,
            itemRequested,
            quantity: parseFloat(quantity),
            unit,
            reason,
            barangay: farmer.barangay,
            status: 'pending'
        });

        await claim.save();
        res.json({ success: true, message: 'Claim submitted successfully', claim });
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({ error: 'Failed to submit claim' });
    }
};

// Submit damage report
export const submitDamageReport = async (req, res) => {
    try {
        const { 
            calamityType, 
            incidentDate, 
            affectedCrop, 
            affectedArea, 
            damagePercentage, 
            description 
        } = req.body;
        
        const farmerId = req.session.userId;
        const farmer = await User.findById(farmerId);
        
        if (!farmer || farmer.role !== 'farmer') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const damageReport = new DamageReport({
            farmerId,
            farmerName: farmer.name,
            barangay: farmer.barangay,
            calamityType,
            incidentDate: new Date(incidentDate),
            affectedCrop,
            affectedArea: parseFloat(affectedArea),
            damagePercentage: parseFloat(damagePercentage),
            description,
            status: 'submitted'
        });

        await damageReport.save();
        res.json({ success: true, message: 'Damage report submitted successfully', damageReport });
    } catch (error) {
        console.error('Error submitting damage report:', error);
        res.status(500).json({ error: 'Failed to submit damage report' });
    }
};

// Apply for crop insurance
export const applyInsurance = async (req, res) => {
    try {
        const { 
            cropType, 
            insuredArea, 
            plantingDate, 
            expectedHarvestDate, 
            insuranceType 
        } = req.body;
        
        const farmerId = req.session.userId;
        const farmer = await User.findById(farmerId);
        
        if (!farmer || farmer.role !== 'farmer') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Calculate premium and coverage based on area and crop type
        const premiumRate = insuranceType === 'comprehensive' ? 0.05 : 0.03;
        const coverageRate = insuranceType === 'comprehensive' ? 50000 : 30000; // per hectare
        
        const premiumAmount = parseFloat(insuredArea) * coverageRate * premiumRate;
        const coverageAmount = parseFloat(insuredArea) * coverageRate;

        const insurance = new Insurance({
            farmerId,
            farmerName: farmer.name,
            barangay: farmer.barangay,
            cropType,
            insuredArea: parseFloat(insuredArea),
            plantingDate: new Date(plantingDate),
            expectedHarvestDate: new Date(expectedHarvestDate),
            insuranceType,
            premiumAmount,
            coverageAmount,
            status: 'pending'
        });

        await insurance.save();
        res.json({ success: true, message: 'Insurance application submitted successfully', insurance });
    } catch (error) {
        console.error('Error applying for insurance:', error);
        res.status(500).json({ error: 'Failed to apply for insurance' });
    }
};

// Get farmer's claims
export const getFarmerClaims = async (req, res) => {
    try {
        const farmerId = req.session.userId;
        const claims = await Claim.findByFarmer(farmerId);
        res.json({ claims });
    } catch (error) {
        console.error('Error getting farmer claims:', error);
        res.status(500).json({ error: 'Failed to load claims' });
    }
};

// Get farmer's damage reports
export const getFarmerDamageReports = async (req, res) => {
    try {
        const farmerId = req.session.userId;
        const damageReports = await DamageReport.findByFarmer(farmerId);
        res.json({ damageReports });
    } catch (error) {
        console.error('Error getting damage reports:', error);
        res.status(500).json({ error: 'Failed to load damage reports' });
    }
};

// Get farmer's insurance applications
export const getFarmerInsurance = async (req, res) => {
    try {
        const farmerId = req.session.userId;
        const insurance = await Insurance.findByFarmer(farmerId);
        res.json({ insurance });
    } catch (error) {
        console.error('Error getting insurance applications:', error);
        res.status(500).json({ error: 'Failed to load insurance applications' });
    }
};

// Get announcements for farmer's barangay
export const getFarmerAnnouncements = async (req, res) => {
    try {
        const farmerId = req.session.userId;
        const farmer = await User.findById(farmerId);
        
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        const announcements = await Announcement.findByBarangay(farmer.barangay);
        res.json({ announcements });
    } catch (error) {
        console.error('Error getting announcements:', error);
        res.status(500).json({ error: 'Failed to load announcements' });
    }
};