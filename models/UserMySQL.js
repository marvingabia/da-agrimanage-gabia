/*
    DA AgriManage - User Model (MySQL)
    Connects to phpMyAdmin MySQL Database
*/

import { getPool } from '../config/database.js';
import bcrypt from 'bcrypt';

export class User {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role; // 'farmer', 'staff', 'admin'
        this.barangay = data.barangay;
        this.phone = data.phone;
        this.dob = data.dob; // Date of Birth
        this.staffingManagement = data.staffingManagement;
        this.authProvider = data.authProvider || 'email';
        this.isApproved = data.isApproved !== undefined ? data.isApproved : (data.role === 'staff' ? false : true);
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    async save() {
        const pool = getPool();
        try {
            // Check if user already exists
            const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [this.id]);
            
            if (existing.length > 0) {
                // Update existing user
                console.log(`📝 Updating existing user: ${this.id}`);
                await pool.query(
                    `UPDATE users SET name = ?, email = ?, role = ?, barangay = ?, phone = ?, dob = ?,
                     staffingManagement = ?, isApproved = ?, updatedAt = NOW() WHERE id = ?`,
                    [this.name, this.email, this.role, this.barangay, this.phone, this.dob, this.staffingManagement, this.isApproved, this.id]
                );
            } else {
                // Create new user - use provided ID or generate one
                if (!this.id) {
                    this.id = `USER-${Date.now()}`;
                }
                
                console.log(`✨ Creating new user in MySQL: ${this.id} (${this.email})`);
                
                // Don't hash password if it's already hashed or if using Google auth
                const passwordToSave = this.password;
                
                await pool.query(
                    `INSERT INTO users (id, name, email, password, role, barangay, phone, dob, staffingManagement, authProvider, isApproved, createdAt) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                    [this.id, this.name, this.email, passwordToSave, this.role, this.barangay, this.phone, this.dob, this.staffingManagement, this.authProvider, this.isApproved]
                );
                
                console.log(`✅ User saved to MySQL successfully: ${this.id}`);
            }
            return this;
        } catch (error) {
            console.error('❌ Error saving user to MySQL:', error.message);
            console.error('   User ID:', this.id);
            console.error('   Email:', this.email);
            throw error;
        }
    }

    static async findById(id) {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows.length > 0 ? new User(rows[0]) : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findByRole(role) {
        const pool = getPool();
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE role = ? ORDER BY createdAt DESC',
                [role]
            );
            return rows.map(row => new User(row));
        } catch (error) {
            console.error('Error finding users by role:', error);
            throw error;
        }
    }

    static async findPendingStaff() {
        const pool = getPool();
        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE role = ? AND isApproved = FALSE ORDER BY createdAt DESC',
                ['staff']
            );
            return rows.map(row => new User(row));
        } catch (error) {
            console.error('Error finding pending staff:', error);
            throw error;
        }
    }

    static async findAll() {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM users ORDER BY createdAt DESC');
            return rows.map(row => new User(row));
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    async verifyPassword(password) {
        if (!this.password) return false;
        return await bcrypt.compare(password, this.password);
    }

    static async approveStaff(staffId) {
        const pool = getPool();
        try {
            await pool.query(
                'UPDATE users SET isApproved = TRUE, updatedAt = NOW() WHERE id = ? AND role = ?',
                [staffId, 'staff']
            );
            return true;
        } catch (error) {
            console.error('Error approving staff:', error);
            throw error;
        }
    }

    static async rejectStaff(staffId) {
        const pool = getPool();
        try {
            await pool.query('DELETE FROM users WHERE id = ? AND role = ?', [staffId, 'staff']);
            return true;
        } catch (error) {
            console.error('Error rejecting staff:', error);
            throw error;
        }
    }

    // Update user (for staff CRUD)
    static async update(id, data) {
        const pool = getPool();
        try {
            const { name, email, barangay, phone, dob } = data;
            
            const [result] = await pool.query(
                `UPDATE users SET name = ?, email = ?, barangay = ?, phone = ?, dob = ?, updatedAt = NOW() 
                 WHERE id = ?`,
                [name, email, barangay, phone, dob, id]
            );
            
            console.log(`✅ Updated user ${id}:`, result.affectedRows, 'rows affected');
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Delete user (for staff CRUD)
    static async delete(id) {
        const pool = getPool();
        try {
            const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
            
            console.log(`✅ Deleted user ${id}:`, result.affectedRows, 'rows affected');
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

export default User;
