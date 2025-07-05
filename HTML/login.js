document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    // Demo users - replace with real authentication
    const users = {
        'admin@example.com': { 
            password: 'admin123', 
            type: 'admin',
            dashboard: 'admindashboard.html'  // Full filename
        },
        'staff@example.com': { 
            password: 'staff123', 
            type: 'staff',
            dashboard: 'staffdashboard.html'
        },
        'student@example.com': { 
            password: 'student123', 
            type: 'student',
            dashboard: 'studentdashboard.html'
        }
    };

    // Validation
    if (!email || !password || !userType) {
        alert('Please fill all fields');
        return;
    }

    if (!users[email]) {
        alert('Email not found');
        return;
    }

    if (users[email].password !== password) {
        alert('Incorrect password');
        return;
    }

    if (users[email].type !== userType) {
        alert(`Please login as ${users[email].type}`);
        return;
    }

    // Store session
    localStorage.setItem('auth', JSON.stringify({
        email: email,
        type: userType,
        dashboard: users[email].dashboard,  // Store complete filename
        loggedInAt: Date.now()
    }));

    // Redirect to specific dashboard
    window.location.href = users[email].dashboard;
});

// Auto-redirect if already logged in
window.addEventListener('DOMContentLoaded', function() {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.dashboard) {
        window.location.href = auth.dashboard;
    }
});