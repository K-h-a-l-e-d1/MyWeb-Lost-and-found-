// 1. TASK DATA (Simulated Database)
const tasks = [
  {
    id: 101,
    category: "Facilities",
    description: "Fix broken AC in Lab 2",
    assignedTo: "Abdullah Khan",
    date: "2025-06-25",
    status: "Overdue"
  },
  {
    id: 102,
    category: "Technical",
    description: "WiFi not working in Block B",
    assignedTo: "Ayesha Rahman",
    date: "2025-07-01",
    status: "In Progress"
  }
];

// 2. INITIALIZE PAGE
document.addEventListener('DOMContentLoaded', function() {
  renderTasks();
  updateYear();
});

// 3. RENDER TASKS IN TABLE
function renderTasks() {
  const tableBody = document.querySelector('#tasksTable tbody');
  tableBody.innerHTML = '';

  tasks.forEach(task => {
    const row = `
      <tr>
        <td>${task.id}</td>
        <td>${task.category}</td>
        <td>${task.description}</td>
        <td>${task.status}</td>
        <td>
          <button onclick="openWarning(${task.id})">⚠️ Warning</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// 4. FILTER TASKS
function filterTasks() {
  const category = document.getElementById('filterCategory').value;
  const date = document.getElementById('filterDate').value;

  const filtered = tasks.filter(task => {
    return (category === '' || task.category === category) &&
           (date === '' || task.date === date);
  });

  renderFilteredTasks(filtered);
}

function renderFilteredTasks(filteredTasks) {
  const tableBody = document.querySelector('#tasksTable tbody');
  tableBody.innerHTML = '';

  filteredTasks.forEach(task => {
    const row = `
      <tr>
        <td>${task.id}</td>
        <td>${task.category}</td>
        <td>${task.description}</td>
        <td>${task.status}</td>
        <td>
          <button onclick="openWarning(${task.id})">⚠️ Warning</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// 5. MODAL FUNCTIONS
function showOverdueTasks() {
  const overdue = tasks.filter(task => task.status === 'Overdue');
  const list = document.getElementById('overdueList');
  list.innerHTML = '';

  overdue.forEach(task => {
    list.innerHTML += `
      <li>
        Task ${task.id}: ${task.description}
        <button onclick="openWarning(${task.id})">Send Warning</button>
      </li>
    `;
  });

  document.getElementById('overdueModal').style.display = 'block';
}

function openWarning(taskId) {
  const task = tasks.find(t => t.id === taskId);
  document.getElementById('warningText').value = 
    `URGENT: Task ${taskId} (${task.description}) is ${task.status}. Please resolve immediately.`;
  document.getElementById('warningModal').style.display = 'block';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.style.display = 'none';
  });
}

function sendWarning() {
  const message = document.getElementById('warningText').value;
  alert(`Warning sent to staff:\n\n${message}`);
  closeModal();
}

// 6. UTILITY FUNCTIONS
function updateYear() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();
}