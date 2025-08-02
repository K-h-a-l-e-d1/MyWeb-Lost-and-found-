// Simple Forgot Password Handler
document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotForm');
    const resetForm = document.getElementById('resetForm');
    const emailStep = document.getElementById('emailStep');
    const resetStep = document.getElementById('resetStep');
    const backToEmail = document.getElementById('backToEmail');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('newPassword');
    
    let userEmail = '';
    
    // Password toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Back to email step
    backToEmail.addEventListener('click', function(e) {
        e.preventDefault();
        showStep('email');
    });
    
    // Email form submission
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showNotification('Email is required', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email', 'error');
            return;
        }
        
        userEmail = email;
        sendResetCode(email);
    });
    
    // Reset form submission
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const resetCode = document.getElementById('resetCode').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        
        if (!resetCode) {
            showNotification('Reset code is required', 'error');
            return;
        }
        
        if (resetCode.length !== 6) {
            showNotification('Reset code must be 6 digits', 'error');
            return;
        }
        
        if (!newPassword) {
            showNotification('New password is required', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        resetPassword(userEmail, resetCode, newPassword);
    });
    
    // Send reset code
    function sendResetCode(email) {
        const submitBtn = forgotForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('action', 'send_reset');
        
        fetch('forgotpass.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            if (data.success) {
                showStep('reset');
                showNotification('Reset code sent to your email!', 'success');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showNotification('Connection error. Please try again.', 'error');
        });
    }
    
    // Reset password
    function resetPassword(email, resetCode, newPassword) {
        const submitBtn = resetForm.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('resetCode', resetCode);
        formData.append('newPassword', newPassword);
        formData.append('action', 'reset_password');
        
        fetch('forgotpass.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            if (data.success) {
                showNotification('Password reset successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showNotification('Connection error. Please try again.', 'error');
        });
    }
    
    // Show/hide steps
    function showStep(stepName) {
        emailStep.classList.remove('active');
        resetStep.classList.remove('active');
        
        if (stepName === 'email') {
            emailStep.classList.add('active');
        } else {
            resetStep.classList.add('active');
        }
    }
    
    // Email validation
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Show notification
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
});