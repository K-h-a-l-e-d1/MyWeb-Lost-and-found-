document.getElementById('complaintForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();

  if (category && description) {
    const complaint = {
      id: Date.now(),
      category,
      description,
      date: new Date().toLocaleDateString(),
      status: 'Unassigned'
    };

    let complaints = JSON.parse(localStorage.getItem('studentComplaints')) || [];
    complaints.push(complaint);
    localStorage.setItem('studentComplaints', JSON.stringify(complaints));

    alert('Complaint submitted successfully!');
    window.location.href = 'studentmycomplaints.html';
  } else {
    alert('Please fill in all fields.');
  }
});
