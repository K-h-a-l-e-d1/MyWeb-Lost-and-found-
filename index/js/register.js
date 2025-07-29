document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  if (!role) {
    alert('Please select a role.');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Proceed with registration logic (e.g. send data to backend)

  alert(`Registration successful as ${role}! (Simulated)`);
  // Redirect to login after registration
  window.location.href = 'login.html';
});
