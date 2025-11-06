/*
    DA AgriManage - Announcement Model
    Handles announcements and notifications
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

export class Announcement {
    constructor(data) {
        this.id = data.id || null;
        this.title = data.title;
        this.message = data.message;
        this.type = data.type; // 'distribution', 'meeting', 'claim_window', 'general'
        this.eventDate = data.eventDate;
        this.venue = data.venue;
        this.targetBarangays = data.targetBarangays || []; // array of barangay names
        this.priority = data.priority || 'normal'; // 'low', 'normal', 'high', 'urgent'
        this.status = data.status || 'active'; // 'active', 'archived'
        this.createdBy = data.createdBy;
        this.createdByName = data.createdByName;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const announcementData = {
                title: this.title,
                message: this.message,
                type: this.type,
                eventDate: this.eventDate,
                venue: this.venue,
                targetBarangays: this.targetBarangays,
                priority: this.priority,
                status: this.status,
                createdBy: this.createdBy,
                createdByName: this.createdByName,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'announcements', this.id), announcementData);
            } else {
                const docRef = doc(collection(db, 'announcements'));
                announcementData.createdAt = new Date();
                await setDoc(docRef, announcementData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save announcement: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'announcements', id));
            if (docSnap.exists()) {
                return new Announcement({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find announcement: ${error.message}`);
        }
    }

    static async findByBarangay(barangay) {
        try {
            const q = query(
                collection(db, 'announcements'), 
                where('targetBarangays', 'array-contains', barangay),
                where('status', '==', 'active'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Announcement({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find announcements by barangay: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const q = query(
                collection(db, 'announcements'), 
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Announcement({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get all announcements: ${error.message}`);
        }
    }

    static async findActive() {
        try {
            const q = query(
                collection(db, 'announcements'), 
                where('status', '==', 'active'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new Announcement({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to get active announcements: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const announcementsSnapshot = await getDocs(collection(db, 'announcements'));
            const announcements = announcementsSnapshot.docs.map(doc => doc.data());
            
            return {
                totalAnnouncements: announcements.length,
                activeAnnouncements: announcements.filter(a => a.status === 'active').length,
                archivedAnnouncements: announcements.filter(a => a.status === 'archived').length,
                urgentAnnouncements: announcements.filter(a => a.priority === 'urgent' && a.status === 'active').length
            };
        } catch (error) {
            throw new Error(`Failed to get announcement stats: ${error.message}`);
        }
    }

    async archive() {
        try {
            this.status = 'archived';
            this.updatedAt = new Date();
            
            await updateDoc(doc(db, 'announcements', this.id), {
                status: this.status,
                updatedAt: this.updatedAt
            });
            
            return this;
        } catch (error) {
            throw new Error(`Failed to archive announcement: ${error.message}`);
        }
    }

    async delete() {
        try {
            if (this.id) {
                await deleteDoc(doc(db, 'announcements', this.id));
                return true;
            }
            return false;
        } catch (error) {
            throw new Error(`Failed to delete announcement: ${error.message}`);
        }
    }
}