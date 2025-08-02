// Sample complaints (to be fetched from DB in real implementation)
const complaints = [
  { id: 1, category: 'Facilities', description: 'Broken chair in room 101', date: '2025-07-01', location: 'Room 101' },
  { id: 2, category: 'Technical Support', description: 'Projector not working', date: '2025-07-02', location: 'Library' },
  { id: 3, category: 'Administrative', description: 'Issue with ID card processing', date: '2025-07-03', location: 'Admin Office' }
];

// Stores selected IDs for rejection
let selectedToReject = [];

// Define the logout function globally
window.logout = function() {
  // Clear session or local storage (based on your app)
  sessionStorage.clear(); // If you are using sessionStorage for session management
  localStorage.clear();  // If you're using localStorage

  // Redirect the user to the login page (adjust path as needed)
  window.location.href = "../../index/html/index.html"; // Redirect to the login page
}

// Load unassigned complaints into the table
function loadUnassignedComplaints() {
  const tbody = document.getElementById('adminunassignedComplaintsBody');
  tbody.innerHTML = '';

  complaints.forEach(c => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><input type="checkbox" value="${c.id}" /></td>
      <td>${c.id}</td>
      <td>${c.category}</td>
      <td>${c.description}</td>
      <td>${c.date}</td>
      <td>${c.location}</td> <!-- Displaying location -->
      <td><button onclick="viewComplaint(${c.id})">View</button></td>
    `;

    tbody.appendChild(tr);
  });
}

// Assign selected complaints to a staff member
function assignComplaints() {
  const selectedIds = Array.from(document.querySelectorAll('#adminunassignedComplaintsBody input[type=checkbox]:checked'))
    .map(cb => parseInt(cb.value));

  const staff = document.getElementById('staffSelect').value;

  if (selectedIds.length === 0 || !staff) {
    alert('Please select complaint(s) and staff to assign.');
    return;
  }

  alert(`Assigned complaints (${selectedIds.join(", ")}) to ${staff}`);
  // Simulate backend update
  selectedIds.forEach(id => {
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) complaints.splice(index, 1);
  });

  loadUnassignedComplaints();
}

// Filter complaints by category
function filterByCategory() {
  const selected = document.getElementById("categoryFilter").value.toLowerCase();
  const rows = document.querySelectorAll("#adminunassignedComplaintsBody tr");

  rows.forEach(row => {
    const categoryCell = row.querySelector("td:nth-child(3)");
    if (!selected || categoryCell.textContent.toLowerCase() === selected) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// Filter complaints by location
function filterByLocation() {
  const selected = document.getElementById("locationFilter").value.toLowerCase();
  const rows = document.querySelectorAll("#adminunassignedComplaintsBody tr");

  rows.forEach(row => {
    const locationCell = row.querySelector("td:nth-child(6)"); // 6th column is for location
    if (!selected || locationCell.textContent.toLowerCase() === selected) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

// View Complaint Details (Optional Extension)
function viewComplaint(id) {
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return;

  document.getElementById("viewId").textContent = complaint.id;
  document.getElementById("viewCategory").textContent = complaint.category;
  document.getElementById("viewDescription").textContent = complaint.description;
  document.getElementById("viewDate").textContent = complaint.date;
  document.getElementById("viewLocation").textContent = complaint.location; // Show location in modal

  openModal("viewModal");
}

// Open the modal
function openModal(id) {
  document.getElementById(id).style.display = "block";
}

// Close the modal
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

// Reject selected complaints
function openRejectModal() {
  selectedToReject = Array.from(document.querySelectorAll('#adminunassignedComplaintsBody input[type=checkbox]:checked'))
    .map(cb => parseInt(cb.value));

  if (selectedToReject.length === 0) {
    alert("Please select complaint(s) to reject.");
    return;
  }

  openModal("rejectModal");
}

function confirmReject() {
  alert(`Rejected complaint(s): ${selectedToReject.join(", ")}`);
  // Simulate backend update
  selectedToReject.forEach(id => {
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) complaints.splice(index, 1);
  });

  closeModal("rejectModal");
  loadUnassignedComplaints();
}

// Init function
window.onload = loadUnassignedComplaints;
