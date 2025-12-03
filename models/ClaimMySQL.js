/*
    DA AgriManage - Claim Model (MySQL)
*/

import { getPool } from '../config/database.js';

export class Claim {
    constructor(data) {
        Object.assign(this, data);
    }

    async save() {
        const pool = getPool();
        try {
            if (!this.id) {
                this.id = `CLM-${Date.now()}`;
            }

            console.log('💾 Saving claim to database...');
            console.log('   ID:', this.id);
            console.log('   Farmer:', this.farmerName);
            console.log('   Claim Type:', this.claimType);
            console.log('   Item:', this.itemRequested);
            console.log('   Quantity:', this.quantity);
            console.log('   Status:', this.status || 'pending');

            const [result] = await pool.query(
                `INSERT INTO claims (id, farmerId, farmerName, barangay, claimType, itemRequested, 
                 quantity, unit, reason, status, createdAt) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [this.id, this.farmerId, this.farmerName, this.barangay, this.claimType, this.itemRequested,
                 this.quantity, this.unit, this.reason, this.status || 'pending']
            );
            
            console.log('✅ Database INSERT result:', result);
            console.log('   Affected rows:', result.affectedRows);
            
            return this;
        } catch (error) {
            console.error('❌ Error saving claim to database:', error);
            console.error('   Error code:', error.code);
            console.error('   Error message:', error.message);
            throw error;
        }
    }

    static async findAll() {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM claims ORDER BY createdAt DESC');
            return rows.map(row => new Claim(row));
        } catch (error) {
            console.error('Error finding claims:', error);
            throw error;
        }
    }

    static async findById(id) {
        const pool = getPool();
        try {
            const [rows] = await pool.query('SELECT * FROM claims WHERE id = ?', [id]);
            return rows.length > 0 ? new Claim(rows[0]) : null;
        } catch (error) {
            console.error('Error finding claim by ID:', error);
            throw error;
        }
    }

    static async findByFarmer(farmerId) {
        const pool = getPool();
        try {
            const [rows] = await pool.query(
                'SELECT * FROM claims WHERE farmerId = ? ORDER BY createdAt DESC',
                [farmerId]
            );
            return rows.map(row => new Claim(row));
        } catch (error) {
            console.error('Error finding claims by farmer:', error);
            throw error;
        }
    }
}

export default Claim;
