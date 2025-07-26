document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const complaintId = parseInt(urlParams.get('id'));
  const complaints = JSON.parse(localStorage.getItem('studentComplaints')) || [];
  const complaint = complaints.find(c => c.id === complaintId);

  const progressSection = document.getElementById('progressDetails');

  if (!complaint) {
    progressSection.innerHTML = '<p>Complaint not found.</p>';
    return;
  }

  progressSection.innerHTML = `
    <h2>Progress Report</h2>
    <p><strong>Category:</strong> ${complaint.category}</p>
    <p><strong>Description:</strong> ${complaint.description}</p>
    <p><strong>Date:</strong> ${complaint.date}</p>
    <p><strong>Status:</strong> ${complaint.status}</p>
    <p><strong>Assigned Staff:</strong> ${complaint.assignedTo || 'Not Assigned'}</p>
    <p><strong>Remarks:</strong> ${complaint.remarks || 'No updates yet.'}</p>
  `;
});
