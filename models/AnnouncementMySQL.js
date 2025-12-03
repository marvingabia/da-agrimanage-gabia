/*
    DA AgriManage - Announcement Model (MySQL)
*/

import { getPool } from '../config/database.js';

export class Announcement {
    constructor(data) {
        Object.assign(this, data);
    }

    async save() {
        const pool = getPool();
        try {
            if (!this.id) {
                this.id = `ANN-${Date.now()}`;
            }

            // Convert targetBarangays array to JSON string
            const targetBarangaysJson = JSON.stringify(this.targetBarangays || ['All']);

            console.log('💾 Saving announcement to database...');
            console.log('   ID:', this.id);
            console.log('   Title:', this.title);
            console.log('   Message:', this.message?.substring(0, 50) + '...');
            console.log('   Type:', this.type);
            console.log('   Status:', this.status || 'active');
            console.log('   Priority:', this.priority || 'normal');
            console.log('   Event Date:', this.eventDate);
            console.log('   Event Time:', this.eventTime);
            console.log('   Venue:', this.venue);
            console.log('   Target Barangays:', targetBarangaysJson);

            const [result] = await pool.query(
                `INSERT INTO announcements (id, title, message, type, eventDate, eventTime, venue, 
                 targetBarangays, priority, status, createdBy, createdByName, createdAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [this.id, this.title, this.message, this.type, this.eventDate, this.eventTime,
                 this.venue, targetBarangaysJson, this.priority || 'normal', this.status || 'active',
                 this.createdBy, this.createdByName]
            );
            
            console.log('✅ Database INSERT result:', result);
            console.log('   Affected rows:', result.affectedRows);
            
            return this;
        } catch (error) {
            console.error('❌ Error saving announcement to database:', error);
            console.error('   Error code:', error.code);
            console.error('   Error message:', error.message);
            console.error('   SQL State:', error.sqlState);
            throw error;
        }
    }

    static async findAll() {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM announcements ORDER BY createdAt DESC');
            return rows.map(row => {
                // Parse JSON targetBarangays if it's a string
                if (typeof row.targetBarangays === 'string') {
                    try {
                        row.targetBarangays = JSON.parse(row.targetBarangays);
                    } catch (e) {
                        row.targetBarangays = ['All'];
                    }
                }
                return new Announcement(row);
            });
        } catch (error) {
            console.error('Error finding announcements:', error);
            throw error;
        }
    }

    static async findActive() {
        const pool = getPool();
        try {
            const [rows] = await pool.query(
                'SELECT * FROM announcements WHERE status = ? ORDER BY createdAt DESC',
                ['active']
            );
            return rows.map(row => {
                // Parse JSON targetBarangays if it's a string
                if (typeof row.targetBarangays === 'string') {
                    try {
                        row.targetBarangays = JSON.parse(row.targetBarangays);
                    } catch (e) {
                        row.targetBarangays = ['All'];
                    }
                }
                return new Announcement(row);
            });
        } catch (error) {
            console.error('Error finding active announcements:', error);
            throw error;
        }
    }

    static async findById(id) {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);
            if (rows.length > 0) {
                // Parse JSON targetBarangays if it's a string
                if (typeof rows[0].targetBarangays === 'string') {
                    try {
                        rows[0].targetBarangays = JSON.parse(rows[0].targetBarangays);
                    } catch (e) {
                        rows[0].targetBarangays = ['All'];
                    }
                }
                return new Announcement(rows[0]);
            }
            return null;
        } catch (error) {
            console.error('Error finding announcement by ID:', error);
            throw error;
        }
    }

    static async findByBarangay(barangay) {
        const pool = getPool();
        try {
            const [rows] = await pool.query(
                `SELECT * FROM announcements 
                 WHERE status = 'active' AND (targetBarangay = ? OR targetBarangay IS NULL OR targetBarangay = 'All') 
                 ORDER BY createdAt DESC`,
                [barangay]
            );
            return rows.map(row => new Announcement(row));
        } catch (error) {
            console.error('Error finding announcements by barangay:', error);
            throw error;
        }
    }
}

export default Announcement;
