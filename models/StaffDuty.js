/*
    Staff Duty Model
    Tracks staff login sessions and duty approval
*/

// In-memory storage for staff duty sessions
let staffDutySessions = [];

class StaffDutySession {
    constructor(data) {
        this.id = data.id || Date.now();
        this.staffId = data.staffId;
        this.staffName = data.staffName;
        this.staffEmail = data.staffEmail;
        this.loginTime = data.loginTime || new Date().toISOString();
        this.logoutTime = data.logoutTime || null;
        this.dutyStatus = data.dutyStatus || 'pending'; // pending, approved, rejected, ended
        this.approvedBy = data.approvedBy || null;
        this.approvedTime = data.approvedTime || null;
        this.notes = data.notes || '';
    }
}

// Create new duty session when staff logs in
export function createDutySession(staffId, staffName, staffEmail) {
    const session = new StaffDutySession({
        staffId,
        staffName,
        staffEmail,
        loginTime: new Date().toISOString(),
        dutyStatus: 'pending'
    });
    
    staffDutySessions.push(session);
    console.log(`Staff duty session created for ${staffName}`);
    return session;
}

// Get all active duty sessions (pending or approved)
export function getActiveDutySessions() {
    return staffDutySessions.filter(session => 
        session.dutyStatus === 'pending' || session.dutyStatus === 'approved'
    ).sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
}

// Get pending duty sessions (waiting for approval)
export function getPendingDutySessions() {
    return staffDutySessions.filter(session => 
        session.dutyStatus === 'pending'
    ).sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
}

// Approve duty session
export function approveDutySession(sessionId, adminName, notes = '') {
    const session = staffDutySessions.find(s => s.id == sessionId);
    if (session) {
        session.dutyStatus = 'approved';
        session.approvedBy = adminName;
        session.approvedTime = new Date().toISOString();
        session.notes = notes;
        console.log(`Duty session ${sessionId} approved by ${adminName}`);
        return session;
    }
    return null;
}

// Reject duty session
export function rejectDutySession(sessionId, adminName, reason = '') {
    const session = staffDutySessions.find(s => s.id == sessionId);
    if (session) {
        session.dutyStatus = 'rejected';
        session.approvedBy = adminName;
        session.approvedTime = new Date().toISOString();
        session.notes = reason;
        session.logoutTime = new Date().toISOString();
        console.log(`Duty session ${sessionId} rejected by ${adminName}`);
        return session;
    }
    return null;
}

// End duty session (logout)
export function endDutySession(sessionId, adminName = null, notes = '') {
    const session = staffDutySessions.find(s => s.id == sessionId);
    if (session) {
        session.dutyStatus = 'ended';
        session.logoutTime = new Date().toISOString();
        if (adminName) {
            session.endedBy = adminName;
            session.endedTime = new Date().toISOString();
            session.endNotes = notes;
        }
        console.log(`Duty session ${sessionId} ended${adminName ? ` by ${adminName}` : ''}`);
        return session;
    }
    return null;
}

// Get staff's current active session
export function getStaffActiveSession(staffId) {
    return staffDutySessions.find(session => 
        session.staffId === staffId && 
        (session.dutyStatus === 'pending' || session.dutyStatus === 'approved')
    );
}

// Get duty statistics
export function getDutyStatistics() {
    return {
        total: staffDutySessions.length,
        pending: staffDutySessions.filter(s => s.dutyStatus === 'pending').length,
        approved: staffDutySessions.filter(s => s.dutyStatus === 'approved').length,
        rejected: staffDutySessions.filter(s => s.dutyStatus === 'rejected').length,
        ended: staffDutySessions.filter(s => s.dutyStatus === 'ended').length,
        activeNow: staffDutySessions.filter(s => s.dutyStatus === 'approved').length
    };
}

// Get all duty sessions
export function getAllDutySessions() {
    return staffDutySessions.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
}

export default StaffDutySession;
