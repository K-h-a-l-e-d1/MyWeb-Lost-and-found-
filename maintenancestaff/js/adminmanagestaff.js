// Sample staff data (in real app, this would come from database)
let staffMembers = [
  {
    id: 1,
    name: 'Mike Johnson',
    email: 'staff@test.com',
    department: 'Maintenance',
    status: 1,
    created_date: '2025-01-01'
  },
  {
    id: 2,
    name: 'Bob Wilson',
    email: 'bob@test.com',
    department: 'IT Support',
    status: 1,
    created_date: '2025-01-02'
  },
  {
    id: 3,
    name: 'Tom Davis',
    email: 'tom@test.com',
    department: 'Facilities',
    status: 1,
    created_date: '2025-01-03'
  }
];

let editingStaffId = null;
let deletingStaffId = null;

// Load staff data on page load
document.addEventListener('DOMContentLoaded', function() {
  loadStaffData();
  setupFormHandlers();
});

// Load and display staff data
function loadStaffData(filteredData = null) {
  const tableBody = document.getElementById('staffTableBody');
  tableBody.innerHTML = '';
  
  const dataToShow = filteredData || staffMembers;
  
  if (dataToShow.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">
          <h3>No staff members found</h3>
          <p>Add your first staff member to get started.</p>
        </td>
      </tr>
    `;
    return;
  }
  
  dataToShow.forEach(staff => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${staff.id}</td>
      <td>${staff.name}</td>
      <td>${staff.email}</td>
      <td>${staff.department}</td>
      <td><span class="status ${staff.status ? 'active' : 'inactive'}">${staff.status ? 'Active' : 'Inactive'}</span></td>
      <td>${staff.created_date}</td>
      <td>
        <button class="action-btn edit" onclick="editStaff(${staff.id})">Edit</button>
        <button class="action-btn delete" onclick="deleteStaff(${staff.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Toggle add staff form
function toggleAddForm() {
  const form = document.getElementById('addStaffForm');
  const btn = document.querySelector('.toggle-form-btn');
  
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    btn.textContent = '- Cancel';
    btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  } else {
    form.style.display = 'none';
    btn.textContent = '+ Add Staff';
    btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    document.getElementById('staffForm').reset();
  }
}

// Cancel add form
function cancelAddForm() {
  document.getElementById('addStaffForm').style.display = 'none';
  const btn = document.querySelector('.toggle-form-btn');
  btn.textContent = '+ Add Staff';
  btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
  document.getElementById('staffForm').reset();
}

// Setup form handlers
function setupFormHandlers() {
  // Add staff form handler
  document.getElementById('staffForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('staffName').value.trim(),
      email: document.getElementById('staffEmail').value.trim(),
      password: document.getElementById('staffPassword').value,
      department: document.getElementById('staffDepartment').value
    };
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    if (!isValidEmail(formData.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    
    // Check if email already exists
    if (staffMembers.some(staff => staff.email.toLowerCase() === formData.email.toLowerCase())) {
      showNotification('A staff member with this email already exists', 'error');
      return;
    }
    
    addNewStaff(formData);
  });
  
  // Edit staff form handler
  document.getElementById('editStaffForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveStaffChanges();
  });
}

// Add new staff member
function addNewStaff(formData) {
  // In real app, this would be an API call to PHP backend
  const newStaff = {
    id: Math.max(...staffMembers.map(s => s.id)) + 1,
    name: formData.name,
    email: formData.email,
    department: formData.department,
    status: 1,
    created_date: new Date().toISOString().split('T')[0]
  };
  
  // Simulate API call
  showNotification('Adding staff member...', 'info');
  
  setTimeout(() => {
    staffMembers.push(newStaff);
    loadStaffData();
    cancelAddForm();
    showNotification(`Staff member ${formData.name} added successfully!`, 'success');
  }, 1000);
}

// Edit staff member
function editStaff(staffId) {
  const staff = staffMembers.find(s => s.id === staffId);
  if (!staff) return;
  
  editingStaffId = staffId;
  
  // Populate edit form
  document.getElementById('editStaffId').value = staff.id;
  document.getElementById('editStaffName').value = staff.name;
  document.getElementById('editStaffEmail').value = staff.email;
  document.getElementById('editStaffDepartment').value = staff.department;
  document.getElementById('editStaffStatus').value = staff.status;
  
  openModal('editStaffModal');
}

// Save staff changes
function saveStaffChanges() {
  const formData = {
    id: parseInt(document.getElementById('editStaffId').value),
    name: document.getElementById('editStaffName').value.trim(),
    email: document.getElementById('editStaffEmail').value.trim(),
    department: document.getElementById('editStaffDepartment').value,
    status: parseInt(document.getElementById('editStaffStatus').value)
  };
  
  // Validate form data
  if (!formData.name || !formData.email || !formData.department) {
    showNotification('Please fill all required fields', 'error');
    return;
  }
  
  if (!isValidEmail(formData.email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Check if email already exists (excluding current staff)
  if (staffMembers.some(staff => staff.id !== formData.id && staff.email.toLowerCase() === formData.email.toLowerCase())) {
    showNotification('A staff member with this email already exists', 'error');
    return;
  }
  
  // Update staff member
  const staffIndex = staffMembers.findIndex(s => s.id === formData.id);
  if (staffIndex !== -1) {
    staffMembers[staffIndex] = { ...staffMembers[staffIndex], ...formData };
    loadStaffData();
    closeModal('editStaffModal');
    showNotification('Staff member updated successfully!', 'success');
  }
}

// Delete staff member
function deleteStaff(staffId) {
  const staff = staffMembers.find(s => s.id === staffId);
  if (!staff) return;
  
  deletingStaffId = staffId;
  
  // Populate delete confirmation
  document.getElementById('deleteStaffName').textContent = staff.name;
  document.getElementById('deleteStaffEmail').textContent = staff.email;
  
  openModal('deleteStaffModal');
}

// Confirm staff deletion
function confirmDeleteStaff() {
  if (!deletingStaffId) return;
  
  // Remove staff member
  staffMembers = staffMembers.filter(s => s.id !== deletingStaffId);
  loadStaffData();
  closeModal('deleteStaffModal');
  showNotification('Staff member deleted successfully!', 'success');
  
  deletingStaffId = null;
}

// Filter staff by department
function filterStaff() {
  const department = document.getElementById('departmentFilter').value;
  
  if (!department) {
    loadStaffData();
    return;
  }
  
  const filteredStaff = staffMembers.filter(staff => staff.department === department);
  loadStaffData(filteredStaff);
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  
  if (modalId === 'editStaffModal') {
    editingStaffId = null;
  }
  
  if (modalId === 'deleteStaffModal') {
    deletingStaffId = null;
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };
  
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <span>${icons[type] || icons.info}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after timeout
  const timeout = type === 'error' ? 6000 : 4000;
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }
  }, timeout);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// Add notification animations
if (!document.getElementById('staff-animations')) {
  const style = document.createElement('style');
  style.id = 'staff-animations';
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
