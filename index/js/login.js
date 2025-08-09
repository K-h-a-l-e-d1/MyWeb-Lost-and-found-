// Login Form Handler - Fixed with Proper Session Management
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    // Clear any existing sessions when accessing login page
    clearPreviousSession();
    
    // Test connection on page load
    testConnection();
    
    // Password visibility toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });
    }
    
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
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('Form submitted, gathering data...');
            
            // Get form data
            const formData = {
                email: document.getElementById('email')?.value?.trim() || '',
                password: document.getElementById('password')?.value || '',
                userType: document.getElementById('userType')?.value || '',
                rememberMe: document.getElementById('rememberMe')?.checked || false
            };
            
            console.log('Form data collected:', {
                email: formData.email,
                userType: formData.userType,
                rememberMe: formData.rememberMe,
                passwordLength: formData.password.length
            });
            
            // Validate all fields
            if (validateForm(formData)) {
                submitLogin(formData);
            }
        });
    }
    
    // Clear previous session function
    function clearPreviousSession() {
        // Clear sessionStorage
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('user_email');
        sessionStorage.removeItem('user_type');
        sessionStorage.removeItem('logged_in');
        sessionStorage.removeItem('login_time');
        
        console.log('Previous session data cleared');
    }
    
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
                } else if (value.length < 1) {
                    errorMessage = 'Password cannot be empty';
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
        ['email', 'password', 'userType'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !validateField(field)) {
                isValid = false;
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
        console.log('Starting login submission...');
        showLoading(true);
        
        // Create form data for PHP
        const phpFormData = new FormData();
        phpFormData.append('email', formData.email);
        phpFormData.append('password', formData.password);
        phpFormData.append('userType', formData.userType);
        phpFormData.append('rememberMe', formData.rememberMe);
        
        console.log('Sending login request to login.php...');
        
        // Send to PHP login handler
        fetch('login.php', {
            method: 'POST',
            body: phpFormData
        })
        .then(response => {
            console.log('Response received:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response.text(); // Get as text first
        })
        .then(text => {
            console.log('Raw response text:', text);
            
            // Try to parse as JSON
            try {
                const data = JSON.parse(text);
                console.log('Parsed JSON response:', data);
                handleLoginResponse(data, formData);
            } catch (e) {
                console.error('JSON parse error:', e);
                console.error('Response was:', text);
                
                // Check if response contains HTML (error page)
                if (text.includes('<html>') || text.includes('<!DOCTYPE')) {
                    showLoginError('Server error: Received HTML instead of JSON. Check PHP configuration.');
                } else {
                    showLoginError('Server returned invalid response: ' + text.substring(0, 100));
                }
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            showLoginError('Connection error: ' + error.message);
        })
        .finally(() => {
            showLoading(false);
        });
    }
    
    // Handle login response
    function handleLoginResponse(data, formData) {
        console.log('Handling login response:', data);
        
        if (data.success) {
            // Store user information in sessionStorage for dashboard use
            if (data.user) {
                sessionStorage.setItem('user_id', data.user.id);
                sessionStorage.setItem('user_name', data.user.name);
                sessionStorage.setItem('user_email', data.user.email);
                sessionStorage.setItem('user_type', data.user.type);
                sessionStorage.setItem('logged_in', 'true');
                sessionStorage.setItem('login_time', new Date().toISOString());
                
                console.log('User data stored in sessionStorage:', {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    type: data.user.type
                });
            }
            
            // Success
            showSuccess(data.message || 'Login successful! Redirecting to your dashboard...');
            
            // Store remember me preference
            if (formData.rememberMe) {
                localStorage.setItem('rememberUser', formData.email);
                console.log('Remember me preference saved');
            } else {
                localStorage.removeItem('rememberUser');
            }
            
            // Redirect after short delay
            setTimeout(() => {
                console.log('Redirecting to:', data.redirectUrl);
                if (data.redirectUrl) {
                    // Replace current page in history to prevent back button issues
                    window.location.replace(data.redirectUrl);
                } else {
                    // Fallback redirect based on user type
                    const fallbackUrls = {
                        'admin': '../admin/html/admindashboard.html',
                        'staff': '../maintenancestaff/html/maintenancestaffdashboard.html',
                        'student': '../student/html/studentdashboard.html'
                    };
                    const redirectUrl = fallbackUrls[formData.userType] || '../student/html/studentdashboard.html';
                    console.log('Using fallback redirect:', redirectUrl);
                    window.location.replace(redirectUrl);
                }
            }, 1500);
            
        } else {
            // Show error message
            showLoginError(data.message || 'Login failed. Please try again.');
        }
    }
    
    // Show loading state
    function showLoading(show) {
        if (loginBtn) {
            if (show) {
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
            } else {
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }
    }
    
    // Show success message
    function showSuccess(message) {
        showNotification(message, 'success');
    }
    
    // Show login error
    function showLoginError(message) {
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
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after timeout
        const timeout = type === 'error' ? 8000 : 5000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, timeout);
    }
    
    // Check for remembered user (only email, not auto-login)
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        const emailField = document.getElementById('email');
        const rememberCheckbox = document.getElementById('rememberMe');
        if (emailField) {
            emailField.value = rememberedUser;
            console.log('Loaded remembered user:', rememberedUser);
        }
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
    
    // Add notification animations to CSS dynamically
    if (!document.getElementById('login-animations')) {
        const style = document.createElement('style');
        style.id = 'login-animations';
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
    }
});

// Test database connection
function testConnection() {
    console.log('Testing server connection...');
    
    fetch('login.php', {
        method: 'POST',
        body: new FormData() // Empty form data to test connection
    })
    .then(response => response.text())
    .then(text => {
        console.log('Server connection test response:', text);
        try {
            const data = JSON.parse(text);
            if (data.success) {
                console.log('✅ Server connection successful');
            }
        } catch (e) {
            console.log('❌ Server connection test failed - non-JSON response');
        }
    })
    .catch(error => {
        console.error('❌ Server connection test failed:', error);
    });
}

// Auto-focus email field on page load
window.addEventListener('load', function() {
    const emailField = document.getElementById('email');
    if (emailField && !emailField.value) {
        emailField.focus();
    }
});

// FIXED: Prevent browser caching and auto-login issues
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Page was loaded from cache, reload it
        window.location.reload();
    }
});

// FIXED: Clear session when navigating to login page
window.addEventListener('beforeunload', function() {
    // Only clear if we're navigating away from login to another page
    // This prevents the auto-login loop
});

// Prevent back button auto-login by checking URL
if (window.location.pathname.includes('login.html')) {
    // Clear session storage to prevent auto-login
    sessionStorage.removeItem('logged_in');
    sessionStorage.removeItem('user_type');
}