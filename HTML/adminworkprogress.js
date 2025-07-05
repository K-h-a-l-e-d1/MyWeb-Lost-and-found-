// Dummy data representing work progress
let workTasks = [
  {
    id: 1,
    category: "Facilities",
    description: "Fix broken fan in Room 204.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-01",
    status: "Assigned"
  },
  {
    id: 2,
    category: "Technical Support",
    description: "Repair WiFi in Lab 3.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-03",
    status: "In Progress"
  },
  {
    id: 3,
    category: "Administrative",
    description: "Issue ID card printing delay.",
    staff: "Abdullah Khan",
    assignDate: "2025-07-02",
    status: "Completed"
  }
];

// Render tasks in the table
function renderTasks(data) {
  const tbody = document.getElementById("workProgressBody");
  tbody.innerHTML = "";

  data.forEach(task => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.category}</td>
      <td>${task.description}</td>
      <td>${task.staff}</td>
      <td>${task.assignDate}</td>
      <td>${task.status}</td>
      <td>
        <select onchange="updateStatus(${task.id}, this.value)">
          <option value="Assigned" ${task.status === "Assigned" ? "selected" : ""}>Assigned</option>
          <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Delayed" ${task.status === "Delayed" ? "selected" : ""}>Delayed</option>
        </select>
      </td>
      <td><button onclick="viewTask(${task.id})">View</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Apply filter by category and date
function applyFilter() {
  const category = document.getElementById("filterCategory").value;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  const filtered = workTasks.filter(task => {
    const matchCategory = category === "" || task.category === category;
    const matchFrom = !fromDate || task.assignDate >= fromDate;
    const matchTo = !toDate || task.assignDate <= toDate;
    return matchCategory && matchFrom && matchTo;
  });

  renderTasks(filtered);
}

// Update the status of a task in data and re-render
function updateStatus(id, newStatus) {
  const task = workTasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    renderTasks(workTasks);
  }
}

// Show task details in popup modal
function viewTask(id) {
  const task = workTasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById("modalId").textContent = task.id;
  document.getElementById("modalCategory").textContent = task.category;
  document.getElementById("modalDescription").textContent = task.description;
  document.getElementById("modalStaff").textContent = task.staff;
  document.getElementById("modalAssignDate").textContent = task.assignDate;
  document.getElementById("modalStatus").textContent = task.status;

  document.getElementById("taskModal").style.display = "block";
}

// Close modal setup
function setupModal() {
  const modal = document.getElementById("taskModal");
  const closeBtn = document.getElementById("modalClose");

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

window.onload = () => {
  renderTasks(workTasks);
  setupModal();
};
