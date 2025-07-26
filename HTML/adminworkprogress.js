// Task data (simulating database or dynamic content)
const tasks = [
  {id: '001', category: 'Facilities', description: 'Fix broken air conditioning in Room 205', assignedTo: 'Abdullah Khan', date: '2025-07-15', status: 'Overdue'},
  {id: '002', category: 'Technical Support', description: 'Network connectivity issues in Lab 3', assignedTo: 'Abdullah Khan', date: '2025-07-20', status: 'In Progress'},
  {id: '003', category: 'Administrative', description: 'Update student database records', assignedTo: 'Abdullah Khan', date: '2025-07-22', status: 'Completed'},
  {id: '004', category: 'Academic Issues', description: 'Resolve grading system error', assignedTo: 'Abdullah Khan', date: '2025-07-25', status: 'Pending'},
];

// Function to filter tasks based on category and date range
function filterTasks() {
  const filterCategory = document.getElementById("filterCategory").value;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  // Convert string date to Date objects for filtering
  const from = fromDate ? new Date(fromDate) : null;
  const to = toDate ? new Date(toDate) : null;

  // Filter tasks based on category and date range
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date);
    const isCategoryMatch = filterCategory === '' || task.category === filterCategory;
    const isWithinDateRange = (!from || taskDate >= from) && (!to || taskDate <= to);

    return isCategoryMatch && isWithinDateRange;
  });

  // Clear the existing table
  const tableBody = document.getElementById("tasksTableBody");
  tableBody.innerHTML = '';

  // Add filtered rows to the table
  filteredTasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.category}</td>
      <td>${task.description}</td>
      <td>${task.assignedTo}</td>
      <td>${task.date}</td>
      <td><span class="status-${task.status.toLowerCase().replace(' ', '-')}" >${task.status}</span></td>
      <td>
        <button class="warning-btn" onclick="openWarningModal('${task.id}')">Send Warning</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Initial load (load all tasks by default)
filterTasks();

// Function to view only overdue tasks
function viewOverdueTasks() {
  // Filter only overdue tasks
  const overdueTasks = tasks.filter(task => task.status === 'Overdue');
  
  // Hide the main table and show the overdue tasks section
  document.getElementById("tasksTable").style.display = "none";
  document.getElementById("overdueTasksSection").style.display = "block";

  // Clear the overdue tasks table
  const overdueTasksBody = document.getElementById("overdueTasksBody");
  overdueTasksBody.innerHTML = '';

  // Add overdue tasks to the table
  overdueTasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.category}</td>
      <td>${task.description}</td>
      <td>${task.assignedTo}</td>
      <td>${task.date}</td>
      <td><span class="status-${task.status.toLowerCase().replace(' ', '-')}" >${task.status}</span></td>
    `;
    overdueTasksBody.appendChild(row);
  });
}

// Function to go back to the main tasks table
function backToTasks() {
  document.getElementById("tasksTable").style.display = "table";
  document.getElementById("overdueTasksSection").style.display = "none";
}

// Function to open the warning modal
function openWarningModal(taskId) {
  // Store the task ID in a global variable or modal data
  window.selectedTaskId = taskId;
  document.getElementById("warningModal").style.display = "block";
}

// Function to close the warning modal
function closeWarningModal() {
  document.getElementById("warningModal").style.display = "none";
}

// Function to send the warning
function sendWarning() {
  const warningMessage = document.getElementById("warningText").value;
  if (warningMessage) {
    alert(`Warning sent to task ID ${window.selectedTaskId}: ${warningMessage}`);
    closeWarningModal();
  } else {
    alert("Please enter a warning message.");
  }
}

// Event listener to close the warning modal if the user clicks outside of it
window.onclick = function(event) {
  if (event.target == document.getElementById("warningModal")) {
    closeWarningModal();
  }
}
