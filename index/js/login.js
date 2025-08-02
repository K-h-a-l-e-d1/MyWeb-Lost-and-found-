// Login Form Handler - Ready for PHP Integration
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const btnText = document.querySelector('.btn-text');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Input validation and styling
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(this);
            validateField(this);
        });
        
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            userType: document.getElementById('userType').value,
            rememberMe: document.getElementById('rememberMe').checked
        };
        
        // Validate all fields
        if (validateForm(formData)) {
            submitLogin(formData);
        }
    });
    
    // Field validation function
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        switch(field.id) {
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters';
                    isValid = false;
                }
                break;
                
            case 'userType':
                if (!value) {
                    errorMessage = 'Please select a user type';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            showError(field, errorMessage);
        } else {
            clearError(field);
        }
        
        return isValid;
    }
    
    // Form validation
    function validateForm(data) {
        let isValid = true;
        
        // Validate each field
        Object.keys(data).forEach(key => {
            if (key !== 'rememberMe') {
                const field = document.getElementById(key);
                if (!validateField(field)) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        // Add error styling to field
        field.style.borderColor = '#ef4444';
        field.style.background = 'rgba(239, 68, 68, 0.05)';
    }
    
    // Clear error message
    function clearError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        // Remove error styling
        field.style.borderColor = '#e2e8f0';
        field.style.background = 'rgba(255, 255, 255, 0.8)';
    }
    
    // Submit login data to PHP
    function submitLogin(formData) {
        // Show loading state
        showLoading(true);
        
        // Create form data for PHP
        const phpFormData = new FormData();
        phpFormData.append('email', formData.email);
        phpFormData.append('password', formData.password);
        phpFormData.append('userType', formData.userType);
        phpFormData.append('rememberMe', formData.rememberMe);
        
        // Send to PHP login handler
        fetch('login_handler.php', {
            method: 'POST',
            body: phpFormData
        })
        .then(response => response.json())
        .then(data => {
            showLoading(false);
            
            if (data.success) {
                // Success - redirect to dashboard
                showSuccess('Login successful! Redirecting...');
                
                // Store session data if needed
                if (formData.rememberMe) {
                    localStorage.setItem('rememberUser', formData.email);
                }
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = data.redirectUrl;
                }, 1500);
                
            } else {
                // Show error message
                showLoginError(data.message || 'Login failed. Please try again.');
            }
        })
        .catch(error => {
            showLoading(false);
            console.error('Login error:', error);
            showLoginError('Connection error. Please try again.');
        });
    }
    
    // Show loading state
    function showLoading(show) {
        if (show) {
            loginBtn.classList.add('loading');
            loginBtn.disabled = true;
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }
    
    // Show success message
    function showSuccess(message) {
        // Create and show success notification
        showNotification(message, 'success');
    }
    
    // Show login error
    function showLoginError(message) {
        // Create and show error notification
        showNotification(message, 'error');
    }
    
    // Generic notification function
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '❌'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('email').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Add notification animations to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 18px;
        }
        
        .notification-message {
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});

// Auto-redirect if already logged in (check PHP session)
window.addEventListener('load', function() {
    // Check if user is already logged in via PHP session
    fetch('check_session.php')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                window.location.href = data.dashboardUrl;
            }
        })
        .catch(error => {
            console.log('Session check failed:', error);
        });
});