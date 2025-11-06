// CRUD Modal System for AgriSystem Dashboard
class ModalManager {
    constructor() {
        this.currentModal = null;
        this.modalContainer = document.getElementById('modal-container');
    }

    // Create and show modal
    showModal(type, data = null, isEdit = false) {
        // Check if user has permission (admin only for CRUD operations)
        const userRole = this.getCurrentUserRole();
        if (userRole !== 'admin') {
            this.showToast('Access denied. Only administrators can perform CRUD operations.', 'error');
            return;
        }
        
        const modalConfig = this.getModalConfig(type, data, isEdit);
        const modalHTML = this.generateModalHTML(modalConfig);
        
        this.modalContainer.innerHTML = modalHTML;
        
        const modal = new bootstrap.Modal(document.getElementById('crudModal'));
        this.currentModal = modal;
        
        // Initialize form handlers
        this.initializeFormHandlers(type, data, isEdit);
        
        modal.show();
    }
    
    // Get current user role from the page
    getCurrentUserRole() {
        // Try to get from global variable or DOM
        if (window.currentUserRole) {
            return window.currentUserRole;
        }
        
        // Try to get from the page title or other indicators
        const title = document.title;
        if (title.includes('Admin')) return 'admin';
        if (title.includes('Staff')) return 'staff';
        if (title.includes('Farmer')) return 'farmer';
        
        // Default to admin for test dashboard
        return 'admin';
    }

    // Get modal configuration based on type
    getModalConfig(type, data, isEdit) {
        // 15 Barangays list
        const barangays = [
            'Bagong Sikat', 'Balatasan', 'Benli', 'Cabugao', 'Cambunang',
            'Campaasan', 'Maasin', 'Maujao', 'Milagrosa', 'Nasukob',
            'Poblacion', 'San Francisco', 'San Isidro', 'San Juan', 'San Roque'
        ];
        
        // Farmer names from global data
        const farmerNames = window.appData && window.appData.farmers ? 
            window.appData.farmers.map(f => f.name) : 
            ['Juan Dela Cruz', 'Maria Santos', 'Pedro Garcia', 'Ana Reyes', 'Carlos Lopez'];
        
        const configs = {
            farmer: {
                title: isEdit ? 'Edit Farmer' : 'Add New Farmer',
                icon: 'fas fa-user',
                fields: [
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
                    { name: 'barangay', label: 'Barangay', type: 'select', required: true, options: barangays },
                    { name: 'landArea', label: 'Land Area (hectares)', type: 'number', required: true, step: '0.1' },
                    { name: 'landType', label: 'Land Type', type: 'select', required: true, options: [
                        'Irrigated', 'Rainfed', 'Upland', 'Lowland'
                    ]},
                    { name: 'description', label: 'Additional Information', type: 'textarea', required: false },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'active', 'inactive', 'pending'
                    ]}
                ]
            },
            staff: {
                title: isEdit ? 'Edit Staff Member' : 'Add New Staff Member',
                icon: 'fas fa-user-tie',
                fields: [
                    { name: 'name', label: 'Full Name', type: 'text', required: true },
                    { name: 'email', label: 'Email Address', type: 'email', required: true },
                    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
                    { name: 'position', label: 'Position', type: 'text', required: true },
                    { name: 'barangay', label: 'Assigned Barangay', type: 'select', required: true, options: ['All Barangays'].concat(barangays) },
                    { name: 'description', label: 'Job Description', type: 'textarea', required: false },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'active', 'inactive', 'pending'
                    ]}
                ]
            },
            inventory: {
                title: isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item',
                icon: 'fas fa-boxes',
                fields: [
                    { name: 'itemName', label: 'Item Name', type: 'text', required: true },
                    { name: 'type', label: 'Type', type: 'select', required: true, options: [
                        'seeds', 'fertilizer', 'equipment', 'pesticide', 'other'
                    ]},
                    { name: 'variety', label: 'Variety/Brand', type: 'text', required: false },
                    { name: 'quantity', label: 'Quantity', type: 'number', required: true, step: '0.1' },
                    { name: 'unit', label: 'Unit', type: 'select', required: true, options: [
                        'kg', 'sacks', 'pieces', 'liters', 'boxes'
                    ]},
                    { name: 'barangay', label: 'Location/Barangay', type: 'select', required: true, options: ['Main Warehouse'].concat(barangays) },
                    { name: 'description', label: 'Description/Notes', type: 'textarea', required: true },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'available', 'reserved', 'distributed', 'damaged'
                    ]}
                ]
            },
            claim: {
                title: isEdit ? 'Edit Claim' : 'Submit New Claim',
                icon: 'fas fa-file-invoice',
                fields: [
                    { name: 'farmerName', label: 'Farmer Name', type: 'select', required: true, options: farmerNames },
                    { name: 'claimType', label: 'Claim Type', type: 'select', required: true, options: [
                        'seeds', 'fertilizer', 'equipment', 'allowance', 'other'
                    ]},
                    { name: 'itemRequested', label: 'Item Requested', type: 'text', required: true },
                    { name: 'quantity', label: 'Quantity', type: 'number', required: true, step: '0.1' },
                    { name: 'unit', label: 'Unit', type: 'select', required: true, options: [
                        'kg', 'sacks', 'pieces', 'liters', 'pesos'
                    ]},
                    { name: 'reason', label: 'Reason/Justification', type: 'textarea', required: true },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'pending', 'approved', 'rejected', 'processing'
                    ]}
                ]
            },
            announcement: {
                title: isEdit ? 'Edit Announcement' : 'Create New Announcement',
                icon: 'fas fa-bullhorn',
                fields: [
                    { name: 'title', label: 'Announcement Title', type: 'text', required: true },
                    { name: 'type', label: 'Type', type: 'select', required: true, options: [
                        'distribution', 'meeting', 'claim_window', 'training', 'general'
                    ]},
                    { name: 'message', label: 'Message', type: 'textarea', required: true },
                    { name: 'priority', label: 'Priority', type: 'select', required: true, options: [
                        'low', 'normal', 'high', 'urgent'
                    ]},
                    { name: 'targetBarangays', label: 'Target Barangays', type: 'multiselect', required: true, options: ['All Barangays'].concat(barangays) },
                    { name: 'eventDate', label: 'Event Date (if applicable)', type: 'datetime-local', required: false },
                    { name: 'venue', label: 'Venue (if applicable)', type: 'text', required: false },
                    { name: 'description', label: 'Additional Details', type: 'textarea', required: false },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'active', 'archived', 'draft'
                    ]}
                ]
            },
            'damage-report': {
                title: isEdit ? 'Edit Damage Report' : 'Submit Damage Report',
                icon: 'fas fa-exclamation-triangle',
                fields: [
                    { name: 'farmerName', label: 'Farmer Name', type: 'text', required: true },
                    { name: 'barangay', label: 'Barangay', type: 'select', required: true, options: barangays },
                    { name: 'calamityType', label: 'Calamity Type', type: 'select', required: true, options: [
                        'typhoon', 'flood', 'drought', 'pest', 'disease', 'fire', 'other'
                    ]},
                    { name: 'incidentDate', label: 'Incident Date', type: 'date', required: true },
                    { name: 'affectedCrop', label: 'Affected Crop', type: 'text', required: true },
                    { name: 'affectedArea', label: 'Affected Area (hectares)', type: 'number', required: true, step: '0.1' },
                    { name: 'damagePercentage', label: 'Damage Percentage', type: 'number', required: true, min: '0', max: '100' },
                    { name: 'description', label: 'Detailed Description/Justification', type: 'textarea', required: true },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'submitted', 'verified', 'processed', 'rejected'
                    ]}
                ]
            },
            insurance: {
                title: isEdit ? 'Edit Insurance Application' : 'Apply for Crop Insurance',
                icon: 'fas fa-shield-alt',
                fields: [
                    { name: 'farmerName', label: 'Farmer Name', type: 'text', required: true },
                    { name: 'barangay', label: 'Barangay', type: 'select', required: true, options: barangays },
                    { name: 'cropType', label: 'Crop Type', type: 'text', required: true },
                    { name: 'insuredArea', label: 'Insured Area (hectares)', type: 'number', required: true, step: '0.1' },
                    { name: 'plantingDate', label: 'Planting Date', type: 'date', required: true },
                    { name: 'expectedHarvestDate', label: 'Expected Harvest Date', type: 'date', required: true },
                    { name: 'insuranceType', label: 'Insurance Type', type: 'select', required: true, options: [
                        'basic', 'comprehensive'
                    ]},
                    { name: 'premiumAmount', label: 'Premium Amount', type: 'number', required: false, step: '0.01' },
                    { name: 'coverageAmount', label: 'Coverage Amount', type: 'number', required: false, step: '0.01' },
                    { name: 'description', label: 'Application Reason/Justification', type: 'textarea', required: true },
                    { name: 'status', label: 'Status', type: 'select', required: true, options: [
                        'pending', 'approved', 'rejected', 'active', 'claimed'
                    ]}
                ]
            }
        };

        return configs[type] || configs.farmer;
    }

    // Generate modal HTML
    generateModalHTML(config) {
        const fieldsHTML = config.fields.map(field => this.generateFieldHTML(field)).join('');
        
        return `
            <div class="modal fade" id="crudModal" tabindex="-1" aria-labelledby="crudModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="crudModalLabel">
                                <i class="${config.icon} me-2"></i>${config.title}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="crudForm">
                                <div class="row">
                                    ${fieldsHTML}
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary me-auto" onclick="goBackToDashboard()">
                                <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
                            </button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="saveBtn">
                                <i class="fas fa-save me-2"></i>Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate field HTML
    generateFieldHTML(field) {
        const colClass = field.type === 'textarea' ? 'col-12' : 'col-md-6';
        let inputHTML = '';

        switch (field.type) {
            case 'select':
                const options = field.options.map(option => 
                    `<option value="${option.toLowerCase().replace(/\s+/g, '_')}">${option}</option>`
                ).join('');
                inputHTML = `<select class="form-select" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                    <option value="">Select ${field.label}</option>
                    ${options}
                </select>`;
                break;
            
            case 'multiselect':
                const multioptions = field.options.map(option => 
                    `<option value="${option.toLowerCase().replace(/\s+/g, '_')}">${option}</option>`
                ).join('');
                inputHTML = `<select class="form-select" id="${field.name}" name="${field.name}" multiple ${field.required ? 'required' : ''}>
                    ${multioptions}
                </select>`;
                break;
            
            case 'textarea':
                inputHTML = `<textarea class="form-control" id="${field.name}" name="${field.name}" rows="4" ${field.required ? 'required' : ''}></textarea>`;
                break;
            
            default:
                const attributes = [];
                if (field.required) attributes.push('required');
                if (field.step) attributes.push(`step="${field.step}"`);
                if (field.min) attributes.push(`min="${field.min}"`);
                if (field.max) attributes.push(`max="${field.max}"`);
                
                inputHTML = `<input type="${field.type}" class="form-control" id="${field.name}" name="${field.name}" ${attributes.join(' ')}>`;
                break;
        }

        return `
            <div class="${colClass} mb-3">
                <label for="${field.name}" class="form-label">
                    ${field.label}${field.required ? ' <span class="text-danger">*</span>' : ''}
                </label>
                ${inputHTML}
            </div>
        `;
    }

    // Initialize form handlers
    initializeFormHandlers(type, data, isEdit) {
        const form = document.getElementById('crudForm');
        const saveBtn = document.getElementById('saveBtn');

        // Populate form if editing
        if (isEdit && data) {
            this.populateForm(form, data);
        }

        // Handle save button click
        saveBtn.addEventListener('click', () => {
            if (form.checkValidity()) {
                const formData = new FormData(form);
                const jsonData = Object.fromEntries(formData.entries());
                
                this.handleSave(type, jsonData, isEdit);
            } else {
                form.reportValidity();
            }
        });
    }

    // Populate form with existing data
    populateForm(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key];
                } else if (field.tagName === 'SELECT' && field.multiple) {
                    const values = Array.isArray(data[key]) ? data[key] : [data[key]];
                    Array.from(field.options).forEach(option => {
                        option.selected = values.includes(option.value);
                    });
                } else {
                    field.value = data[key];
                }
            }
        });
    }

    // Handle save operation
    handleSave(type, data, isEdit) {
        // Show loading state
        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
        saveBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            console.log(`${isEdit ? 'Updating' : 'Creating'} ${type}:`, data);
            
            // Add/update data in global storage for real-time updates
            this.updateGlobalData(type, data, isEdit);
            
            // Show success message
            this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
            
            // Close modal
            this.currentModal.hide();
            
            // Refresh the current table and update stats
            if (typeof window.refreshCurrentTable === 'function') {
                window.refreshCurrentTable();
            }
            
            if (typeof window.updateQuickStatsAfterChange === 'function') {
                window.updateQuickStatsAfterChange();
            }
            
            // Reset button
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 1000);
    }

    // Update global data storage
    updateGlobalData(type, data, isEdit) {
        if (!window.appData) return;
        
        const typeMap = {
            'farmer': 'farmers',
            'staff': 'staff',
            'inventory': 'inventory',
            'claim': 'claims',
            'damage-report': 'damageReports',
            'insurance': 'insurance',
            'announcement': 'announcements'
        };
        
        const dataKey = typeMap[type];
        if (!dataKey) return;
        
        // Initialize array if it doesn't exist
        if (!window.appData[dataKey]) {
            window.appData[dataKey] = [];
        }
        
        if (isEdit) {
            // Update existing record
            const index = window.appData[dataKey].findIndex(item => item.id == data.id);
            if (index !== -1) {
                window.appData[dataKey][index] = { ...window.appData[dataKey][index], ...data };
            }
        } else {
            // Add new record
            const existingIds = window.appData[dataKey].map(item => item.id || 0);
            const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
            const newRecord = { id: newId, ...data, date: new Date().toISOString().split('T')[0] };
            
            // Format data based on type
            if (type === 'farmer') {
                newRecord.landArea = `${data.landArea} hectares`;
            } else if (type === 'inventory') {
                newRecord.quantity = parseFloat(data.quantity);
            } else if (type === 'claim') {
                newRecord.quantity = `${data.quantity} ${data.unit}`;
                newRecord.farmer = data.farmerName;
            } else if (type === 'staff') {
                // Staff specific formatting
                newRecord.name = data.name;
                newRecord.email = data.email;
                newRecord.position = data.position;
                newRecord.barangay = data.barangay;
                newRecord.description = data.description;
                newRecord.status = data.status;
            } else if (type === 'damage-report') {
                // Damage report specific formatting
                newRecord.farmer = data.farmerName;
                newRecord.calamityType = data.calamityType;
                newRecord.affectedCrop = data.affectedCrop;
                newRecord.damagePercentage = parseFloat(data.damagePercentage);
                newRecord.affectedArea = parseFloat(data.affectedArea);
                newRecord.incidentDate = data.incidentDate;
                newRecord.description = data.description;
                newRecord.barangay = data.barangay;
                newRecord.status = data.status;
            } else if (type === 'insurance') {
                // Insurance specific formatting
                newRecord.farmer = data.farmerName;
                newRecord.cropType = data.cropType;
                newRecord.insuredArea = parseFloat(data.insuredArea);
                newRecord.plantingDate = data.plantingDate;
                newRecord.expectedHarvestDate = data.expectedHarvestDate;
                newRecord.insuranceType = data.insuranceType;
                newRecord.premiumAmount = parseFloat(data.premiumAmount || 0);
                newRecord.coverageAmount = parseFloat(data.coverageAmount || 0);
                newRecord.description = data.description;
                newRecord.barangay = data.barangay;
                newRecord.status = data.status;
            }
            
            window.appData[dataKey].push(newRecord);
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        // Add toast to container
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Show toast
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Initialize modal manager
const modalManager = new ModalManager();

// Global modal functions
window.openFarmerModal = (data = null) => modalManager.showModal('farmer', data, !!data);
window.openStaffModal = (data = null) => modalManager.showModal('staff', data, !!data);
window.openInventoryModal = (data = null) => modalManager.showModal('inventory', data, !!data);
window.openClaimModal = (data = null) => modalManager.showModal('claim', data, !!data);
window.openDamageReportModal = (data = null) => modalManager.showModal('damage-report', data, !!data);
window.openInsuranceModal = (data = null) => modalManager.showModal('insurance', data, !!data);
window.openAnnouncementModal = (data = null) => modalManager.showModal('announcement', data, !!data);

// Edit functions
window.editFarmer = (id) => {
    // In a real app, fetch data from API
    const mockData = { id, name: 'Juan Dela Cruz', email: 'juan@example.com', phone: '+63123456789', barangay: 'barangay_1', landArea: 2.5, landType: 'irrigated', status: 'active' };
    modalManager.showModal('farmer', mockData, true);
};

window.editInventory = (id) => {
    const mockData = { id, itemName: 'Rice Seeds', type: 'seeds', variety: 'IR64', quantity: 100, unit: 'kg', barangay: 'barangay_1', description: 'High quality rice seeds', status: 'available' };
    modalManager.showModal('inventory', mockData, true);
};

window.editClaim = (id) => {
    const mockData = { id, farmerName: 'juan_dela_cruz', claimType: 'seeds', itemRequested: 'Rice Seeds', quantity: 10, unit: 'kg', reason: 'For planting season', status: 'pending' };
    modalManager.showModal('claim', mockData, true);
};

window.editAnnouncement = (id) => {
    const mockData = { id, title: 'Seed Distribution', type: 'distribution', message: 'Free seed distribution for all farmers', priority: 'high', targetBarangays: ['all_barangays'], eventDate: '2024-02-01T09:00', venue: 'Municipal Hall', status: 'active' };
    modalManager.showModal('announcement', mockData, true);
};

// Back to dashboard function
window.goBackToDashboard = () => {
    if (typeof window.navigateToSection === 'function') {
        window.navigateToSection('dashboard');
    }
};

// Delete functions with confirmation
window.deleteFarmer = (id) => confirmDelete('farmer', id, 'farmers');
window.deleteInventory = (id) => confirmDelete('inventory item', id, 'inventory');
window.deleteAnnouncement = (id) => confirmDelete('announcement', id, 'announcements');
window.deleteStaff = (id) => confirmDelete('staff member', id, 'staff');
window.deleteDamageReport = (id) => confirmDelete('damage report', id, 'damageReports');
window.deleteInsurance = (id) => confirmDelete('insurance policy', id, 'insurance');

function confirmDelete(type, id, dataKey) {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        // Remove from global data if exists
        if (window.appData && window.appData[dataKey]) {
            const index = window.appData[dataKey].findIndex(item => item.id == id);
            if (index !== -1) {
                window.appData[dataKey].splice(index, 1);
            }
        }
        
        modalManager.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`, 'success');
        
        // Refresh current table and update stats
        if (typeof window.refreshCurrentTable === 'function') {
            setTimeout(() => {
                window.refreshCurrentTable();
                if (typeof window.updateQuickStatsAfterChange === 'function') {
                    window.updateQuickStatsAfterChange();
                }
            }, 500);
        }
    }
}

// Status update functions
window.approveClaim = (id) => updateStatus('claim', id, 'approved', 'claims');
window.rejectClaim = (id) => updateStatus('claim', id, 'rejected', 'claims');
window.verifyDamageReport = (id) => updateStatus('damage report', id, 'verified', 'damageReports');
window.approveInsurance = (id) => updateStatus('insurance', id, 'approved', 'insurance');

// Edit functions for new sections
window.editStaff = (id) => {
    const mockData = { id, name: 'Alice Johnson', email: 'alice@agrisystem.com', position: 'Agricultural Technician', barangay: 'barangay_1', status: 'active' };
    modalManager.showModal('staff', mockData, true);
};

window.editDamageReport = (id) => {
    const mockData = { id, farmerName: 'juan_dela_cruz', calamityType: 'typhoon', incidentDate: '2024-01-10', affectedCrop: 'Rice', affectedArea: 2.5, damagePercentage: 75, description: 'Severe damage due to strong winds', status: 'verified' };
    modalManager.showModal('damage-report', mockData, true);
};

window.editInsurance = (id) => {
    const mockData = { id, farmerName: 'juan_dela_cruz', cropType: 'Rice', insuredArea: 2.5, plantingDate: '2024-01-01', expectedHarvestDate: '2024-06-01', insuranceType: 'comprehensive', premiumAmount: 2500, coverageAmount: 125000, status: 'active' };
    modalManager.showModal('insurance', mockData, true);
};

function updateStatus(type, id, status, dataKey) {
    // Update in global data if exists
    if (window.appData && window.appData[dataKey]) {
        const index = window.appData[dataKey].findIndex(item => item.id == id);
        if (index !== -1) {
            window.appData[dataKey][index].status = status;
        }
    }
    
    modalManager.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} ${status} successfully!`, 'success');
    
    // Refresh current table
    if (typeof window.refreshCurrentTable === 'function') {
        setTimeout(() => window.refreshCurrentTable(), 500);
    }
}