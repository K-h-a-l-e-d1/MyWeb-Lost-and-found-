document.addEventListener("DOMContentLoaded", function () { 
  const form = document.getElementById("createTaskForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    const category = document.getElementById("category").value.trim();
    const description = document.getElementById("description").value.trim();
    const staff = document.getElementById("staff").value;

    if (!category || !description || !staff) {
      alert("⚠️ Please fill out all fields before submitting.");
      return;
    }

    // Prepare data to be sent to the backend
    const taskData = {
      category: category,
      description: description,
      staff: staff,
    };

    // Send the data to PHP backend using fetch API
    fetch('backend/create_task.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData), // Send data as JSON
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`✅ Task successfully assigned to ${staff}`);
        form.reset(); // Reset the form after submission
      } else {
        alert("❌ Error creating task. Please try again.");
      }
    })
    .catch(error => {
      console.error("Error creating task:", error);
      alert("❌ Something went wrong. Please try again later.");
    });
  });

  // Logout function
  window.logout = function() {
    // Clear session or local storage (based on your app)
    sessionStorage.clear(); // If you are using sessionStorage for session management
    localStorage.clear();  // If you're using localStorage

    // Redirect the user to the login page (adjust path as needed)
    window.location.href = "../../index/html/index.html"; // Redirect to the login page
  }
});
