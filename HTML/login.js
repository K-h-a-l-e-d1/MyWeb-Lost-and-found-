document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // For demo, simple user-role map (replace with real backend auth later)
  const userRoleMap = {
    'student1': 'student',
    'admin1': 'admin',
    'staff1': 'maintenance',
  };

  if (!username || !password) {
    alert('Please enter both username and password');
    return;
  }

  const role = userRoleMap[username.toLowerCase()];

  if (!role) {
    alert('Invalid username or password');
    return;
  }

  alert(`Login successful as ${role}! (Simulated)`);

  if (role === 'student') {
    window.location.href = 'studentdashboard.html';
  } else if (role === 'admin') {
    window.location.href = 'admindashboard.html';
  } else if (role === 'maintenance') {
    window.location.href = 'staffdashboard.html';
  }
});
