# 👥 User Roles and Permissions

## 🎯 Clear Role Definitions

### 👨‍💼 ADMIN - Monitoring & Viewing Only
**Purpose:** System oversight and monitoring

**Permissions:**
- ✅ **VIEW** all data (read-only)
- ✅ **MONITOR** system activities
- ✅ **APPROVE/REJECT** staff registrations
- ✅ **VIEW** reports and analytics
- ❌ **NO CRUD** operations on farmers, inventory, claims, etc.
- ❌ **NO CREATE/EDIT/DELETE** of records

**Access:**
- Dashboard (view all statistics)
- Farmers List (view only)
- Insurance (view only)
- Damage Reports (view only)
- Claims/Benefits (view only)
- Request Letters (view only)
- Inventory (view only)
- Announcements (view only)
- Staff Management (approve/reject staff only)

---

### 👨‍💻 STAFF - Full CRUD Operations
**Purpose:** Day-to-day operations and data management

**Permissions:**
- ✅ **CREATE** new records
- ✅ **READ** all data
- ✅ **UPDATE** existing records
- ✅ **DELETE** records
- ✅ **MANAGE** farmers (full CRUD)
- ✅ **MANAGE** inventory (full CRUD)
- ✅ **DISTRIBUTE** benefits/claims
- ✅ **RESPOND** to farmer requests
- ✅ **CREATE** announcements

**Access:**
- Dashboard (view statistics)
- Farmers List (CREATE, READ, UPDATE, DELETE)
- Insurance (view, process)
- Damage Reports (view, verify)
- Claims/Benefits (CREATE, READ, UPDATE, DELETE)
- Request Letters (READ, RESPOND)
- Inventory (CREATE, READ, UPDATE, DELETE)
- Announcements (CREATE, READ, UPDATE, DELETE)

---

### 👨‍🌾 FARMER - Submit & View Own Data
**Purpose:** Submit applications and view own records

**Permissions:**
- ✅ **SUBMIT** insurance applications
- ✅ **SUBMIT** damage reports
- ✅ **SUBMIT** request letters
- ✅ **VIEW** own submissions
- ✅ **VIEW** announcements
- ❌ **NO ACCESS** to other farmers' data
- ❌ **NO CRUD** operations

**Access:**
- Dashboard (view own statistics)
- Insurance (submit, view own)
- Damage Reports (submit, view own)
- Claims (view own benefits)
- Request Letters (submit, view own)
- Announcements (view only)

---

## 📊 Permission Matrix

| Feature | Admin | Staff | Farmer |
|---------|-------|-------|--------|
| **Farmers Management** |
| View Farmers | ✅ | ✅ | ❌ |
| Create Farmer | ❌ | ✅ | ❌ |
| Edit Farmer | ❌ | ✅ | ❌ |
| Delete Farmer | ❌ | ✅ | ❌ |
| **Inventory** |
| View Inventory | ✅ | ✅ | ❌ |
| Add Item | ❌ | ✅ | ❌ |
| Edit Item | ❌ | ✅ | ❌ |
| Delete Item | ❌ | ✅ | ❌ |
| **Claims/Benefits** |
| View Claims | ✅ | ✅ | ✅ (own) |
| Distribute Benefit | ❌ | ✅ | ❌ |
| Edit Benefit | ❌ | ✅ | ❌ |
| Delete Benefit | ❌ | ✅ | ❌ |
| **Damage Reports** |
| View Reports | ✅ | ✅ | ✅ (own) |
| Submit Report | ❌ | ❌ | ✅ |
| Verify Report | ❌ | ✅ | ❌ |
| **Insurance** |
| View Applications | ✅ | ✅ | ✅ (own) |
| Submit Application | ❌ | ❌ | ✅ |
| Process Application | ❌ | ✅ | ❌ |
| **Request Letters** |
| View Requests | ✅ | ✅ | ✅ (own) |
| Submit Request | ❌ | ❌ | ✅ |
| Respond to Request | ❌ | ✅ | ❌ |
| **Announcements** |
| View Announcements | ✅ | ✅ | ✅ |
| Create Announcement | ❌ | ✅ | ❌ |
| Edit Announcement | ❌ | ✅ | ❌ |
| Delete Announcement | ❌ | ✅ | ❌ |
| **Staff Management** |
| View Staff | ✅ | ❌ | ❌ |
| Approve Staff | ✅ | ❌ | ❌ |
| Reject Staff | ✅ | ❌ | ❌ |

---

## 🔐 Implementation

### Backend (routes/index.js)
```javascript
// Admin - View only
requireRole(['admin'])          // Can only view

// Staff - Full CRUD
requireRole(['staff'])          // Can CREATE, READ, UPDATE, DELETE

// Staff or Admin - View
requireRole(['staff', 'admin']) // Both can view

// Farmer - Own data only
requireAuth                     // Can view/submit own data
```

### Frontend (views)
```handlebars
{{!-- Admin - View only, no action buttons --}}
{{#if (eq user.role 'admin')}}
    <button disabled>View Only</button>
{{/if}}

{{!-- Staff - Full CRUD buttons --}}
{{#if (eq user.role 'staff')}}
    <button onclick="create()">Create</button>
    <button onclick="edit()">Edit</button>
    <button onclick="delete()">Delete</button>
{{/if}}

{{!-- Farmer - Submit only --}}
{{#if (eq user.role 'farmer')}}
    <button onclick="submit()">Submit</button>
{{/if}}
```

---

## 📝 Summary

**ADMIN = Monitor & Approve**
- Read-only access to all data
- Approve/reject staff registrations
- View reports and analytics
- NO CRUD operations

**STAFF = Full Operations**
- Complete CRUD on all modules
- Manage farmers, inventory, claims
- Respond to requests
- Create announcements

**FARMER = Submit & View Own**
- Submit applications and reports
- View own submissions
- View announcements
- NO access to other data

---

## ✅ Benefits of This Structure

1. **Clear Separation** - Each role has distinct responsibilities
2. **Security** - Admin can't accidentally modify data
3. **Accountability** - Staff performs all operations (audit trail)
4. **Simplicity** - Easy to understand and maintain
5. **Scalability** - Easy to add new roles if needed
