document.addEventListener('DOMContentLoaded', function () {
  const complaintList = document.getElementById('complaintList');

  // Fetch complaints data from backend (PHP)
  fetch('backend/get_complaints.php')  // Backend endpoint to get the complaints
    .then(response => response.json())
    .then(complaints => {
      if (complaints.length === 0) {
        complaintList.innerHTML = '<tr><td colspan="4" class="empty-state"><h3>No complaints submitted yet.</h3><p>Submit your first complaint to see it here.</p></td></tr>';
        return;
      }

      complaints.forEach(c => {
        const row = document.createElement('tr');
        
        // Apply status class for styling
        const statusClass = c.status.toLowerCase().replace(/\s+/g, '-');
        
        row.innerHTML = `
          <td>${c.id}</td>
          <td>${c.title}</td>
          <td><span class="status ${statusClass}">${c.status}</span></td>
          <td><button onclick="viewProgress(${c.id})">View Progress</button></td>
        `;
        complaintList.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching complaints:', error);
    });
});

// Function to view progress in the enhanced modal
function viewProgress(id) {
  // Fetch complaint details from the backend
  fetch(`backend/get_complaint_details.php?id=${id}`)  // Get specific complaint details
    .then(response => response.json())
    .then(complaint => {
      if (!complaint) {
        document.getElementById("progressDetails").innerHTML = '<p>Complaint not found.</p>';
        return;
      }

      // Apply status class for consistent styling
      const statusClass = complaint.status.toLowerCase().replace(/\s+/g, '-');

      // Set data in the modal with enhanced structure
      const progressSection = document.getElementById("progressDetails");
      progressSection.innerHTML = `
        <div class="progress-header">Progress Report</div>
        <div class="modal-field"><strong>Complaint ID:</strong> ${complaint.id}</div>
        <div class="modal-field"><strong>Title:</strong> ${complaint.title}</div>
        <div class="modal-field"><strong>Category:</strong> ${complaint.category}</div>
        <div class="modal-field"><strong>Description:</strong> ${complaint.description}</div>
        <div class="modal-field"><strong>Date Submitted:</strong> ${complaint.date}</div>
        <div class="modal-field"><strong>Status:</strong> <span class="status ${statusClass}">${complaint.status}</span></div>
        <div class="modal-field"><strong>Assigned Staff:</strong> ${complaint.assignedTo || 'Not Assigned'}</div>
        <div class="modal-field"><strong>Remarks:</strong> ${complaint.remarks || 'No updates yet.'}</div>
      `;

      // Show the modal (popup)
      document.getElementById("viewProgressModal").style.display = "block";
    })
    .catch(error => {
      console.error('Error fetching complaint details:', error);
    });
}

// Function to close the modal
function closeModal() {
  document.getElementById("viewProgressModal").style.display = "none";
}

// Close modal on clicking outside the modal content or pressing Escape key
function setupModal() {
  const modal = document.getElementById("viewProgressModal");
  const closeBtn = document.querySelector(".modal-close");

  // Close on clicking the X button
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close on clicking outside the modal content
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Close on pressing Escape key
  window.onkeydown = (event) => {
    if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  };
}

// Initialize modal functionality on page load
window.onload = () => {
  setupModal();
};
