/*
    DA AgriManage - Inventory Model
    Handles inventory management operations
*/

import { db } from './firebaseConfig.js';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy 
} from 'firebase/firestore';

export class Inventory {
    constructor(data) {
        this.id = data.id || null;
        this.itemName = data.itemName;
        this.type = data.type; // 'seeds', 'fertilizer', 'equipment', 'other'
        this.variety = data.variety;
        this.quantity = data.quantity;
        this.unit = data.unit; // 'kg', 'sacks', 'pieces', 'liters'
        this.barangay = data.barangay;
        this.description = data.description;
        this.status = data.status || 'available';
        this.createdBy = data.createdBy;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const inventoryData = {
                itemName: this.itemName,
                type: this.type,
                variety: this.variety,
                quantity: this.quantity,
                unit: this.unit,
                barangay: this.barangay,
                description: this.description,
                status: this.status,
                createdBy: this.createdBy,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'inventory', this.id), inventoryData);
            } else {
                const docRef = doc(collection(db, 'inventory'));
                inventoryData.createdAt = new Date();
                await setDoc(docRef, inventoryData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save inventory item: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'inventory', id));
            if (docSnap.exists()) {
                return new Inventory({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find inventory item: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Inventory({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get inventory items: ${error.message}`);
        }
    }

    static async findByBarangay(barangay) {
        try {
            const q = query(
                collection(db, 'inventory'), 
                where('barangay', '==', barangay),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Inventory({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find inventory by barangay: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const inventorySnapshot = await getDocs(collection(db, 'inventory'));
            const items = inventorySnapshot.docs.map(doc => doc.data());
            
            return {
                totalItems: items.length,
                availableItems: items.filter(item => item.status === 'available').length,
                seedsCount: items.filter(item => item.type === 'seeds').length,
                fertilizersCount: items.filter(item => item.type === 'fertilizer').length
            };
        } catch (error) {
            throw new Error(`Failed to get inventory stats: ${error.message}`);
        }
    }

    async delete() {
        try {
            if (this.id) {
                await deleteDoc(doc(db, 'inventory', this.id));
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Failed to delete inventory item: ${error.message}`);
        }
    }
}