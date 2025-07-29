// Dummy assigned complaints data
let assignedComplaints = [
  {
    id: 1,
    category: "Facilities",
    description: "Fan is not working in Room 204.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-01",
    status: "Assigned"
  },
  {
    id: 2,
    category: "Technical Support",
    description: "WiFi not working in Lab 3.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-03",
    status: "In Progress"
  },
  {
    id: 3,
    category: "Administrative",
    description: "ID card printing delayed.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-02",
    status: "Completed"
  }
];

// Render complaints in the table
function renderComplaints(data) {
  const tbody = document.getElementById("assignedComplaintsBody");
  tbody.innerHTML = "";

  data.forEach(complaint => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${complaint.id}</td>
      <td>${complaint.category}</td>
      <td>${complaint.description}</td>
      <td>${complaint.staff}</td>
      <td>${complaint.assignDate}</td>
      <td>${complaint.status}</td>
      <td><button onclick="viewComplaint(${complaint.id})">View</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Apply filter based on category and date range
function applyFilter() {
  const category = document.getElementById("filterCategory").value;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  const filtered = assignedComplaints.filter(c => {
    const matchCategory = category === "" || c.category === category;
    const matchFrom = !fromDate || c.assignDate >= fromDate;
    const matchTo = !toDate || c.assignDate <= toDate;
    return matchCategory && matchFrom && matchTo;
  });

  renderComplaints(filtered);
}

// Show complaint details in popup modal
function viewComplaint(id) {
  const complaint = assignedComplaints.find(c => c.id === id);
  if (!complaint) return;

  document.getElementById("modalId").textContent = complaint.id;
  document.getElementById("modalCategory").textContent = complaint.category;
  document.getElementById("modalDescription").textContent = complaint.description;
  document.getElementById("modalStaff").textContent = complaint.staff;
  document.getElementById("modalAssignDate").textContent = complaint.assignDate;
  document.getElementById("modalStatus").textContent = complaint.status;

  document.getElementById("complaintModal").style.display = "block";
}

// Close modal on clicking the close button or outside the modal content
function setupModal() {
  const modal = document.getElementById("complaintModal");
  const closeBtn = document.getElementById("modalClose");

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

function removeComplaint(id) {
  if (confirm("Are you sure you want to reject this complaint?")) {
    // remove from the list
    unassignedComplaints = unassignedComplaints.filter(c => c.id !== id);
    renderComplaints(unassignedComplaints);
  }
}

// Initialize on page load
window.onload = () => {
  renderComplaints(assignedComplaints);
  setupModal();
};
