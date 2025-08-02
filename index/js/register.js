document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const role = document.getElementById('role').value;

  // Basic validation
  if (!username || !email || !password || !confirmPassword || !role) {
    showNotification('Please fill all fields', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showNotification('Passwords do not match!', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }

  // Show loading
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Registering...';
  submitBtn.disabled = true;

  // Create form data
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('confirmPassword', confirmPassword);
  formData.append('role', role);

  // Send to PHP
  fetch('register.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    if (data.success) {
      showNotification('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      showNotification(data.message, 'error');
    }
  })
  .catch(error => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    showNotification('Connection error. Please try again.', 'error');
  });
});

// Show notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <span>${type === 'success' ? '✅' : '❌'}</span>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}