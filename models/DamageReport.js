/*
    DA AgriManage - Damage Report Model
    Handles crop damage reporting
*/

import { db } from './firebaseConfig.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    query,
    where,
    orderBy 
} from 'firebase/firestore';

export class DamageReport {
    constructor(data) {
        this.id = data.id || null;
        this.farmerId = data.farmerId;
        this.farmerName = data.farmerName;
        this.barangay = data.barangay;
        this.calamityType = data.calamityType; // 'typhoon', 'flood', 'drought', 'pest', 'disease'
        this.incidentDate = data.incidentDate;
        this.affectedCrop = data.affectedCrop;
        this.affectedArea = data.affectedArea; // in hectares
        this.damagePercentage = data.damagePercentage;
        this.description = data.description;
        this.status = data.status || 'submitted'; // 'submitted', 'verified', 'processed'
        this.verifiedBy = data.verifiedBy;
        this.verifiedAt = data.verifiedAt;
        this.verificationNotes = data.verificationNotes;
        this.insuranceClaimId = data.insuranceClaimId; // linked insurance claim
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const reportData = {
                farmerId: this.farmerId,
                farmerName: this.farmerName,
                barangay: this.barangay,
                calamityType: this.calamityType,
                incidentDate: this.incidentDate,
                affectedCrop: this.affectedCrop,
                affectedArea: this.affectedArea,
                damagePercentage: this.damagePercentage,
                description: this.description,
                status: this.status,
                verifiedBy: this.verifiedBy,
                verifiedAt: this.verifiedAt,
                verificationNotes: this.verificationNotes,
                insuranceClaimId: this.insuranceClaimId,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'damageReports', this.id), reportData);
            } else {
                const docRef = doc(collection(db, 'damageReports'));
                reportData.createdAt = new Date();
                await setDoc(docRef, reportData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save damage report: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'damageReports', id));
            if (docSnap.exists()) {
                return new DamageReport({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find damage report: ${error.message}`);
        }
    }

    static async findByFarmer(farmerId) {
        try {
            const q = query(
                collection(db, 'damageReports'), 
                where('farmerId', '==', farmerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new DamageReport({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find damage reports by farmer: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const q = query(collection(db, 'damageReports'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new DamageReport({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get all damage reports: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const reportsSnapshot = await getDocs(collection(db, 'damageReports'));
            const reports = reportsSnapshot.docs.map(doc => doc.data());
            
            return {
                totalReports: reports.length,
                submittedReports: reports.filter(r => r.status === 'submitted').length,
                verifiedReports: reports.filter(r => r.status === 'verified').length,
                processedReports: reports.filter(r => r.status === 'processed').length
            };
        } catch (error) {
            throw new Error(`Failed to get damage report stats: ${error.message}`);
        }
    }

    async updateStatus(status, verifiedBy, verificationNotes = '') {
        try {
            this.status = status;
            this.verifiedBy = verifiedBy;
            this.verifiedAt = new Date();
            this.verificationNotes = verificationNotes;
            this.updatedAt = new Date();
            
            await updateDoc(doc(db, 'damageReports', this.id), {
                status: this.status,
                verifiedBy: this.verifiedBy,
                verifiedAt: this.verifiedAt,
                verificationNotes: this.verificationNotes,
                updatedAt: this.updatedAt
            });
            
            return this;
        } catch (error) {
            throw new Error(`Failed to update damage report status: ${error.message}`);
        }
    }
}