// Remove dummy assigned complaints data and fetch data from PHP in real-world application
function fetchAssignedComplaints() {
  // Example of how you might fetch data from a PHP backend (replace with actual API endpoint)
  fetch('backend/get_complaints.php')
    .then(response => response.json())
    .then(data => renderComplaints(data))
    .catch(error => console.error('Error fetching complaints:', error));
}

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

  // Fetch and filter complaints based on user inputs
  fetchAssignedComplaints({ category, fromDate, toDate });
}

// Show complaint details in popup modal
function viewComplaint(id) {
  // Fetch complaint details from PHP backend (replace with actual API endpoint)
  fetch(`backend/get_complaint_details.php?id=${id}`)
    .then(response => response.json())
    .then(complaint => {
      document.getElementById("modalId").textContent = complaint.id;
      document.getElementById("modalCategory").textContent = complaint.category;
      document.getElementById("modalDescription").textContent = complaint.description;
      document.getElementById("modalStaff").textContent = complaint.staff;
      document.getElementById("modalAssignDate").textContent = complaint.assignDate;
      document.getElementById("modalStatus").textContent = complaint.status;
      document.getElementById("complaintModal").style.display = "block";
    })
    .catch(error => console.error('Error fetching complaint details:', error));
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

// Initialize on page load
window.onload = () => {
  fetchAssignedComplaints();
  setupModal();
};
