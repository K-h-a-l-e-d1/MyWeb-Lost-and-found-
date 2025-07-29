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

    // Simulate storing task (you can later replace this with PHP/MySQL)
    console.log("✅ Task Created:");
    console.log("Category:", category);
    console.log("Description:", description);
    console.log("Assigned to:", staff);

    alert(`✅ Task successfully assigned to ${staff}`);

    form.reset(); // Reset the form after submission
  });
});
