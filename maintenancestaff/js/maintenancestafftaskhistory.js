document.addEventListener('DOMContentLoaded', function () {
    loadTaskHistory();
});

function loadTaskHistory() {
    // Fetch real-time task history from the backend
    fetch('backend/get_task_history.php')
        .then(response => response.json())  // Assuming the response is JSON
        .then(taskHistory => {
            const historyTable = document.getElementById('taskHistoryTable');
            taskHistory.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.taskId}</td>
                    <td>${task.complaintId}</td>
                    <td>${task.taskStatus}</td>
                    <td>${task.assignedBy}</td>
                    <td>${task.dateAssigned}</td>
                    <td><button onclick="viewTaskDetails(${task.taskId})">View Details</button></td>
                `;
                historyTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching task history:', error);
        });
}

function viewTaskDetails(taskId) {
    // Redirect to task details page (can be further integrated with backend)
    window.location.href = `taskdetails.html?taskId=${taskId}`;
}
