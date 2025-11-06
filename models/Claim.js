/*
    DA AgriManage - Claim Model
    Handles farmer claims and requests
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

export class Claim {
    constructor(data) {
        this.id = data.id || null;
        this.farmerId = data.farmerId;
        this.farmerName = data.farmerName;
        this.claimType = data.claimType; // 'seeds', 'fertilizer', 'allowance', 'other'
        this.itemRequested = data.itemRequested;
        this.quantity = data.quantity;
        this.unit = data.unit;
        this.reason = data.reason;
        this.status = data.status || 'pending'; // 'pending', 'approved', 'rejected'
        this.barangay = data.barangay;
        this.reviewedBy = data.reviewedBy;
        this.reviewedAt = data.reviewedAt;
        this.reviewNotes = data.reviewNotes;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const claimData = {
                farmerId: this.farmerId,
                farmerName: this.farmerName,
                claimType: this.claimType,
                itemRequested: this.itemRequested,
                quantity: this.quantity,
                unit: this.unit,
                reason: this.reason,
                status: this.status,
                barangay: this.barangay,
                reviewedBy: this.reviewedBy,
                reviewedAt: this.reviewedAt,
                reviewNotes: this.reviewNotes,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'claims', this.id), claimData);
            } else {
                const docRef = doc(collection(db, 'claims'));
                claimData.createdAt = new Date();
                await setDoc(docRef, claimData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save claim: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'claims', id));
            if (docSnap.exists()) {
                return new Claim({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find claim: ${error.message}`);
        }
    }

    static async findByFarmer(farmerId) {
        try {
            const q = query(
                collection(db, 'claims'), 
                where('farmerId', '==', farmerId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Claim({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find claims by farmer: ${error.message}`);
        }
    }

    static async findByStatus(status) {
        try {
            const q = query(
                collection(db, 'claims'), 
                where('status', '==', status),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Claim({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find claims by status: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const q = query(collection(db, 'claims'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Claim({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get all claims: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const claimsSnapshot = await getDocs(collection(db, 'claims'));
            const claims = claimsSnapshot.docs.map(doc => doc.data());
            
            return {
                totalClaims: claims.length,
                pendingClaims: claims.filter(claim => claim.status === 'pending').length,
                approvedClaims: claims.filter(claim => claim.status === 'approved').length,
                rejectedClaims: claims.filter(claim => claim.status === 'rejected').length
            };
        } catch (error) {
            throw new Error(`Failed to get claim stats: ${error.message}`);
        }
    }

    async updateStatus(status, reviewedBy, reviewNotes = '') {
        try {
            this.status = status;
            this.reviewedBy = reviewedBy;
            this.reviewedAt = new Date();
            this.reviewNotes = reviewNotes;
            this.updatedAt = new Date();
            
            await updateDoc(doc(db, 'claims', this.id), {
                status: this.status,
                reviewedBy: this.reviewedBy,
                reviewedAt: this.reviewedAt,
                reviewNotes: this.reviewNotes,
                updatedAt: this.updatedAt
            });
            
            return this;
        } catch (error) {
            throw new Error(`Failed to update claim status: ${error.message}`);
        }
    }
}