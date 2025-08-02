document.getElementById("year").textContent = new Date().getFullYear();

function populateWarnings(filter = 'all') {
  const tableBody = document.getElementById('adminWarningsTableBody');
  tableBody.innerHTML = ''; // Clear existing rows
  
  // Fetch real-time warning data from the backend
  fetch(`backend/get_warnings.php?status=${filter}`)
    .then(response => response.json())
    .then(warnings => {
      warnings.forEach(warning => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${warning.id}</td>
          <td>${warning.dateIssued}</td>
          <td><span class="severity ${warning.severity.toLowerCase()}">${warning.severity}</span></td>
          <td>${warning.title}</td>
          <td><span class="status ${warning.status}">${warning.status.charAt(0).toUpperCase() + warning.status.slice(1)}</span></td>
          <td>
            <button class="action-btn view-details" data-id="${warning.id}">View Details</button>
            <button class="action-btn acknowledge-btn" data-id="${warning.id}">
              ${warning.status === 'unread' ? 'Acknowledge' : 'Acknowledged'}
            </button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Attach event listeners for the "View Details" and "Acknowledge" buttons
      document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', showWarningDetails);
      });

      document.querySelectorAll('.acknowledge-btn').forEach(btn => {
        if (!btn.textContent.includes('Acknowledged')) {
          btn.addEventListener('click', acknowledgeWarning);
        }
      });
    })
    .catch(error => {
      console.error('Error fetching warnings:', error);
    });
}

function showWarningDetails(event) {
  const warningId = event.target.getAttribute('data-id');
  
  // Fetch warning details from the backend
  fetch(`backend/get_warning_details.php?warningId=${warningId}`)
    .then(response => response.json())
    .then(warning => {
      document.getElementById('warning-id').textContent = warning.id;
      document.getElementById('warning-date').textContent = warning.dateIssued;
      document.getElementById('warning-severity').textContent = warning.severity;
      document.getElementById('warning-title').textContent = warning.title;
      document.getElementById('warning-description').textContent = warning.description;
      document.getElementById('admin-notes').textContent = warning.adminNotes;
      document.getElementById('staff-response').value = warning.staffResponse;

      document.getElementById('warningDetailsModal').style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching warning details:', error);
    });
}

function acknowledgeWarning(event) {
  const warningId = event.target.getAttribute('data-id');

  // Update warning status to 'read' in the backend
  fetch(`backend/acknowledge_warning.php?warningId=${warningId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`Warning ${warningId} acknowledged`);
        // Update the UI (disable the acknowledge button and change status)
        event.target.textContent = 'Acknowledged';
        event.target.classList.add('acknowledged');
        event.target.disabled = true;

        // Update status in table
        const statusElement = event.target.closest('tr').querySelector('.status');
        statusElement.textContent = 'Read';
        statusElement.classList.remove('unread');
        statusElement.classList.add('read');
      }
    })
    .catch(error => {
      console.error('Error acknowledging warning:', error);
    });
}

function filterWarnings() {
  const filterValue = document.getElementById('warningStatusFilter').value;
  populateWarnings(filterValue);
}

// Submit staff response to warning
document.querySelector('.submit-response').addEventListener('click', function() {
  const warningId = document.getElementById('warning-id').textContent;
  const response = document.getElementById('staff-response').value;

  // Send response to the backend
  fetch(`backend/submit_warning_response.php?warningId=${warningId}&response=${encodeURIComponent(response)}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Your response has been submitted successfully.');
        document.getElementById('warningDetailsModal').style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error submitting response:', error);
    });
});

// Close the modal
document.querySelectorAll('.modal-close, .cancel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('warningDetailsModal').style.display = 'none';
  });
});

// Initialize the page
window.onload = function() {
  populateWarnings();
};
