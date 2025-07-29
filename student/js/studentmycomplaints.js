document.addEventListener('DOMContentLoaded', function () {
  const complaintList = document.getElementById('complaintList');
  const complaints = [
    {id: 1, title: "Fan not working", status: "In Progress", category: "Electrical", description: "Fan in room 101 is not working", date: "2025-07-20", assignedTo: "John Doe", remarks: "Technician assigned."},
    {id: 2, title: "Broken chair", status: "Assigned", category: "Furniture", description: "Chair in the study room is broken", date: "2025-07-21", assignedTo: "Jane Smith", remarks: "Awaiting parts."}
  ];

  if (complaints.length === 0) {
    complaintList.innerHTML = '<tr><td colspan="4">No complaints submitted yet.</td></tr>';
    return;
  }

  complaints.forEach((c) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.id}</td>
      <td>${c.title}</td>
      <td>${c.status}</td>
      <td><button onclick="viewProgress(${c.id})">View Progress</button></td>
    `;
    complaintList.appendChild(row);
  });
});

// Function to view progress in the modal
function viewProgress(id) {
  const complaints = [
    {id: 1, title: "Fan not working", status: "In Progress", category: "Electrical", description: "Fan in room 101 is not working", date: "2025-07-20", assignedTo: "John Doe", remarks: "Technician assigned."},
    {id: 2, title: "Broken chair", status: "Assigned", category: "Furniture", description: "Chair in the study room is broken", date: "2025-07-21", assignedTo: "Jane Smith", remarks: "Awaiting parts."}
  ];

  const complaint = complaints.find(c => c.id === id);

  // Get the progress details section
  const progressSection = document.getElementById("progressDetails");

  if (!complaint) {
    progressSection.innerHTML = '<p>Complaint not found.</p>';
    return;
  }

  // Set data in the modal
  progressSection.innerHTML = `
    <h2>Progress Report</h2>
    <p><strong>Category:</strong> ${complaint.category}</p>
    <p><strong>Description:</strong> ${complaint.description}</p>
    <p><strong>Date Submitted:</strong> ${complaint.date}</p>
    <p><strong>Status:</strong> ${complaint.status}</p>
    <p><strong>Assigned Staff:</strong> ${complaint.assignedTo || 'Not Assigned'}</p>
    <p><strong>Remarks:</strong> ${complaint.remarks || 'No updates yet.'}</p>
  `;

  // Show the modal (popup)
  document.getElementById("viewProgressModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
  document.getElementById("viewProgressModal").style.display = "none";
}
