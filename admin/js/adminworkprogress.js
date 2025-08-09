// Sample work progress data
const workProgressData = [
  {
    id: 'WP-001',
    type: 'Complaint',
    title: 'Fix broken AC in Room 101',
    assignedTo: 'Mike Johnson',
    assignedDate: '2025-01-15',
    dueDate: '2025-01-18',
    status: 'in-progress',
    progress: 60,
    description: 'Air conditioning unit in room 101 is not working properly. Needs inspection and repair.',
    notes: 'Diagnosed issue with compressor. Ordered replacement parts.'
  },
  {
    id: 'WP-002',
    type: 'Task',
    title: 'Network maintenance in Lab 3',
    assignedTo: 'Bob Wilson',
    assignedDate: '2025-01-14',
    dueDate: '2025-01-16',
    status: 'completed',
    progress: 100,
    description: 'Routine network maintenance and cable management in computer lab 3.',
    notes: 'All network cables organized and tested. Performance improved significantly.'
  },
  {
    id: 'WP-003',
    type: 'Complaint',
    title: 'Leaking faucet in bathroom',
    assignedTo: 'Tom Davis',
    assignedDate: '2025-01-10',
    dueDate: '2025-01-12',
    status: 'overdue',
    progress: 30,
    description: 'Water continuously dripping from faucet in second floor bathroom.',
    notes: 'Waiting for plumber to arrive. Parts have been ordered.'
  },
  {
    id: 'WP-004',
    type: 'Task',
    title: 'Security camera installation',
    assignedTo: 'Mike Johnson',
    assignedDate: '2025-01-16',
    dueDate: '2025-01-20',
    status: 'pending',
    progress: 0,
    description: 'Install new security cameras in parking area.',
    notes: 'Waiting for equipment delivery.'
  },
  {
    id: 'WP-005',
    type: 'Complaint',
    title: 'Broken window in library',
    assignedTo: 'Bob Wilson',
    assignedDate: '2025-01-13',
    dueDate: '2025-01-17',
    status: 'in-progress',
    progress: 80,
    description: 'Large crack in library window needs replacement.',
    notes: 'Glass ordered and will be installed tomorrow.'
  }
];

let currentFilter = {
  staff: '',
  status: '',
  fromDate: '',
  toDate: ''
};

// Load work progress data on page load
document.addEventListener('DOMContentLoaded', function() {
  loadWorkProgressData();
  updateOverviewCards();
  setupEventListeners();
});

// Load and display work progress data
function loadWorkProgressData(filteredData = null) {
  const tableBody = document.getElementById('workProgressTableBody');
  tableBody.innerHTML = '';
  
  const dataToShow = filteredData || workProgressData;
  
  if (dataToShow.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 40px; color: #64748b;">
          <h3>No work items found</h3>
          <p>No work items match the current filters.</p>
        </td>
      </tr>
    `;
    return;
  }
  
  dataToShow.forEach(work => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${work.id}</td>
      <td>${work.type}</td>
      <td>${work.title}</td>
      <td>${work.assignedTo}</td>
      <td>${work.assignedDate}</td>
      <td>${work.dueDate}</td>
      <td><span class="status ${work.status}">${work.status.charAt(0).toUpperCase() + work.status.slice(1).replace('-', ' ')}</span></td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${work.progress}%"></div>
        </div>
        <small>${work.progress}%</small>
      </td>
      <td>
        <button class="action-btn view-details" onclick="viewWorkDetails('${work.id}')">View</button>
        ${work.status === 'overdue' ? `<button class="action-btn send-warning" onclick="sendWarningToStaff('${work.assignedTo}', '${work.id}')">Warn</button>` : ''}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Update overview cards
function updateOverviewCards() {
  const stats = {
    total: workProgressData.length,
    inProgress: workProgressData.filter(w => w.status === 'in-progress').length,
    completed: workProgressData.filter(w => w.status === 'completed').length,
    overdue: workProgressData.filter(w => w.status === 'overdue').length
  };
  
  document.getElementById('totalAssigned').textContent = stats.total;
  document.getElementById('inProgress').textContent = stats.inProgress;
  document.getElementById('completed').textContent = stats.completed;
  document.getElementById('overdue').textContent = stats.overdue;
}

// Setup event listeners
function setupEventListeners() {
  // Warning form handler
  document.getElementById('warningForm').addEventListener('submit', function(e) {
    e.preventDefault();
    sendWarning();
  });
}

// Apply filters
function applyFilters() {
  currentFilter = {
    staff: document.getElementById('staffFilter').value,
    status: document.getElementById('statusFilter').value,
    fromDate: document.getElementById('fromDate').value,
    toDate: document.getElementById('toDate').value
  };
  
  let filteredData = workProgressData;
  
  // Filter by staff
  if (currentFilter.staff) {
    filteredData = filteredData.filter(work => work.assignedTo === currentFilter.staff);
  }
  
  // Filter by status
  if (currentFilter.status) {
    filteredData = filteredData.filter(work => work.status === currentFilter.status);
  }
  
  // Filter by date range
  if (currentFilter.fromDate) {
    filteredData = filteredData.filter(work => work.assignedDate >= currentFilter.fromDate);
  }
  
  if (currentFilter.toDate) {
    filteredData = filteredData.filter(work => work.assignedDate <= currentFilter.toDate);
  }
  
  loadWorkProgressData(filteredData);
  showNotification(`Found ${filteredData.length} work items matching filters`, 'info');
}

// Reset filters
function resetFilters() {
  document.getElementById('staffFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('fromDate').value = '';
  document.getElementById('toDate').value = '';
  
  currentFilter = { staff: '', status: '', fromDate: '', toDate: '' };
  loadWorkProgressData();
  showNotification('Filters reset', 'info');
}

// View work details
function viewWorkDetails(workId) {
  const work = workProgressData.find(w => w.id === workId);
  if (!work) return;
  
  // Populate modal with work details
  document.getElementById('modal-work-id').textContent = work.id;
  document.getElementById('modal-work-type').textContent = work.type;
  document.getElementById('modal-work-title').textContent = work.title;
  document.getElementById('modal-work-description').textContent = work.description;
  document.getElementById('modal-assigned-to').textContent = work.assignedTo;
  document.getElementById('modal-assigned-date').textContent = work.assignedDate;
  document.getElementById('modal-due-date').textContent = work.dueDate;
  document.getElementById('modal-work-status').textContent = work.status.charAt(0).toUpperCase() + work.status.slice(1).replace('-', ' ');
  document.getElementById('modal-progress-notes').textContent = work.notes || 'No progress notes available';
  
  openModal('workDetailsModal');
}

// Send warning to specific staff for specific work
function sendWarningToStaff(staffName, workId) {
  document.getElementById('warningStaff').value = staffName;
  document.getElementById('warningType').value = 'missed_deadline';
  document.getElementById('warningMessage').value = `Your assigned work (${workId}) is overdue. Please provide an update on the current status and expected completion time.`;
  
  openModal('sendWarningModal');
}

// Open warning modal
function openWarningModal() {
  // Clear form
  document.getElementById('warningForm').reset();
  openModal('sendWarningModal');
}

// Send warning
function sendWarning() {
  const formData = {
    staff: document.getElementById('warningStaff').value,
    type: document.getElementById('warningType').value,
    message: document.getElementById('warningMessage').value.trim()
  };
  
  // Validate form
  if (!formData.staff || !formData.type || !formData.message) {
    showNotification('Please fill all fields', 'error');
    return;
  }
  
  // Simulate sending warning
  showNotification('Sending warning...', 'info');
  
  setTimeout(() => {
    closeModal('sendWarningModal');
    showNotification(`Warning sent to ${formData.staff} successfully!`, 'success');
    
    // Reset form
    document.getElementById('warningForm').reset();
  }, 1500);
}

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Utility function for notifications
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
if (!document.getElementById('progress-animations')) {
  const style = document.createElement('style');
  style.id = 'progress-animations';
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
