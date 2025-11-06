/*
    DA AgriManage - Insurance Model
    Handles crop insurance applications
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

export class Insurance {
    constructor(data) {
        this.id = data.id || null;
        this.farmerId = data.farmerId;
        this.farmerName = data.farmerName;
        this.barangay = data.barangay;
        this.cropType = data.cropType;
        this.insuredArea = data.insuredArea; // in hectares
        this.plantingDate = data.plantingDate;
        this.expectedHarvestDate = data.expectedHarvestDate;
        this.insuranceType = data.insuranceType; // 'basic', 'comprehensive'
        this.premiumAmount = data.premiumAmount;
        this.coverageAmount = data.coverageAmount;
        this.status = data.status || 'pending'; // 'pending', 'approved', 'rejected', 'active', 'claimed'
        this.approvedBy = data.approvedBy;
        this.approvedAt = data.approvedAt;
        this.approvalNotes = data.approvalNotes;
        this.policyNumber = data.policyNumber;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const insuranceData = {
                farmerId: this.farmerId,
                farmerName: this.farmerName,
                barangay: this.barangay,
                cropType: this.cropType,
                insuredArea: this.insuredArea,
                plantingDate: this.plantingDate,
                expectedHarvestDate: this.expectedHarvestDate,
                insuranceType: this.insuranceType,
                premiumAmount: this.premiumAmount,
                coverageAmount: this.coverageAmount,
                status: this.status,
                approvedBy: this.approvedBy,
                approvedAt: this.approvedAt,
                approvalNotes: this.approvalNotes,
                policyNumber: this.policyNumber,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'insurance', this.id), insuranceData);
            } else {
                const docRef = doc(collection(db, 'insurance'));
                insuranceData.createdAt = new Date();
                await setDoc(docRef, insuranceData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save insurance application: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'insurance', id));
            if (docSnap.exists()) {
                return new Insurance({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find insurance application: ${error.message}`);
        }
    }

    static async findByFarmer(farmerId) {
        try {
            const q = query(
                collection(db, 'insurance'), 
                where('farmerId', '==', farmerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Insurance({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find insurance by farmer: ${error.message}`);
        }
    }

    static async findByStatus(status) {
        try {
            const q = query(
                collection(db, 'insurance'), 
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Insurance({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find insurance by status: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const q = query(collection(db, 'insurance'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Insurance({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get all insurance applications: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const insuranceSnapshot = await getDocs(collection(db, 'insurance'));
            const applications = insuranceSnapshot.docs.map(doc => doc.data());
            
            return {
                totalApplications: applications.length,
                pendingApplications: applications.filter(app => app.status === 'pending').length,
                approvedApplications: applications.filter(app => app.status === 'approved').length,
                activeInsurance: applications.filter(app => app.status === 'active').length,
                claimedInsurance: applications.filter(app => app.status === 'claimed').length
            };
        } catch (error) {
            throw new Error(`Failed to get insurance stats: ${error.message}`);
        }
    }

    async updateStatus(status, approvedBy, approvalNotes = '', policyNumber = '') {
        try {
            this.status = status;
            this.approvedBy = approvedBy;
            this.approvedAt = new Date();
            this.approvalNotes = approvalNotes;
            if (policyNumber) this.policyNumber = policyNumber;
            this.updatedAt = new Date();
            
            await updateDoc(doc(db, 'insurance', this.id), {
                status: this.status,
                approvedBy: this.approvedBy,
                approvedAt: this.approvedAt,
                approvalNotes: this.approvalNotes,
                policyNumber: this.policyNumber,
                updatedAt: this.updatedAt
            });
            
            return this;
        } catch (error) {
            throw new Error(`Failed to update insurance status: ${error.message}`);
        }
    }

    generatePolicyNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `DA-${year}${month}-${random}`;
    }
}