// Check for warning from admin (this can be replaced by backend API later)
document.addEventListener("DOMContentLoaded", () => {
  const hasWarning = true; // Simulate warning flag (replace with real check)
  const warningBanner = document.getElementById("warningBanner");

  if (hasWarning && warningBanner) {
    warningBanner.style.display = "block";
  }
});

// Navigation function for sidebar buttons
function navigate(page) {
  switch (page) {
    case 'viewwork':
      window.location.href = 'maintenancestaffviewwork.html';
      break;
    case 'updatework':
      window.location.href = 'maintenancestaffupdatework.html';
      break;
    case 'taskhistory':
      window.location.href = 'maintenancestafftaskhistory.html';
      break;
    case 'viewwarnings':
      window.location.href = 'maintenancestaffviewadminwarnings.html';
      break;
    default:
      console.error("Unknown navigation request: " + page);
  }
}

// Logout function
function logout() {
  // Redirect to logout script or login page
  window.location.href = 'logout.php';
}
