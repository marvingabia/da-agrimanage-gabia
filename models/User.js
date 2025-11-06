/*
    DA AgriManage - User Model
    Handles user data operations with Firebase
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

export class User {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.role = data.role; // 'admin', 'staff', 'farmer'
        this.barangay = data.barangay;
        this.landArea = data.landArea;
        this.landType = data.landType;
        this.status = data.status || 'active';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    async save() {
        try {
            const userData = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                role: this.role,
                barangay: this.barangay,
                landArea: this.landArea,
                landType: this.landType,
                status: this.status,
                updatedAt: new Date()
            };

            if (this.id) {
                await updateDoc(doc(db, 'users', this.id), userData);
            } else {
                const docRef = doc(collection(db, 'users'));
                userData.createdAt = new Date();
                await setDoc(docRef, userData);
                this.id = docRef.id;
            }
            
            return this;
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const docSnap = await getDoc(doc(db, 'users', id));
            if (docSnap.exists()) {
                return new User({ id: docSnap.id, ...docSnap.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    static async findByEmail(email) {
        try {
            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return new User({ id: doc.id, ...doc.data() });
            }
            return null;
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }

    static async findByRole(role) {
        try {
            const q = query(
                collection(db, 'users'), 
                where('role', '==', role),
                where('status', '==', 'active'),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => 
                new User({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find users by role: ${error.message}`);
        }
    }

    static async getStats() {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const users = usersSnapshot.docs.map(doc => doc.data());
            
            return {
                totalUsers: users.length,
                activeFarmers: users.filter(u => u.role === 'farmer' && u.status === 'active').length,
                totalStaff: users.filter(u => u.role === 'staff' && u.status === 'active').length,
                totalAdmins: users.filter(u => u.role === 'admin' && u.status === 'active').length
            };
        } catch (error) {
            throw new Error(`Failed to get user stats: ${error.message}`);
        }
    }

    static async createDefaultAdmin() {
        try {
            // Return a default admin object without Firebase dependency
            const adminData = {
                id: 'admin-default-user',
                name: 'System Administrator',
                email: 'admin@gmail.com',
                phone: '+63 123 456 7890',
                role: 'admin',
                barangay: 'Main Office',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            return new User(adminData);
        } catch (error) {
            console.error('Error creating default admin:', error.message);
            return null;
        }
    }
}