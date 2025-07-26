document.addEventListener('DOMContentLoaded', function () {
  const complaintList = document.getElementById('complaintList');
  const complaints = JSON.parse(localStorage.getItem('studentComplaints')) || [];

  if (complaints.length === 0) {
    complaintList.innerHTML = '<p>No complaints submitted yet.</p>';
    return;
  }

  complaints.forEach((c) => {
    const complaintDiv = document.createElement('div');
    complaintDiv.className = 'complaint';

    complaintDiv.innerHTML = `
      <h3>Category: ${c.category}</h3>
      <p>Description: ${c.description}</p>
      <p>Date: ${c.date}</p>
      <p>Status: ${c.status}</p>
      <button onclick="viewProgress(${c.id})">View Progress</button>
    `;

    complaintList.appendChild(complaintDiv);
  });
});

function viewProgress(id) {
  window.location.href = `studentviewprogress.html?id=${id}`;
}
