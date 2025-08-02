document.addEventListener('DOMContentLoaded', function () {
    loadAssignedTasks();
});

function loadAssignedTasks() {
    // Fetch real-time assigned tasks from the backend
    fetch('backend/get_assigned_tasks.php')
        .then(response => response.json())  // Assuming the response is JSON
        .then(tasks => {
            const taskTable = document.getElementById('assignedTaskTable');
            tasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.id}</td>
                    <td>${task.task}</td>
                    <td>${task.status}</td>
                    <td>${task.assignedBy}</td>
                    <td><button onclick="startTask(${task.id})">Start Task</button></td>
                `;
                taskTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching assigned tasks:', error);
        });
}

function startTask(taskId) {
    // Send request to update task status to 'In Progress' in the backend
    fetch(`backend/update_task_status.php?taskId=${taskId}&status=in-progress`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Task ${taskId} is now in progress.`);
                loadAssignedTasks();  // Reload tasks after status update
            } else {
                alert('Failed to update task status.');
            }
        })
        .catch(error => {
            console.error('Error updating task status:', error);
        });
}
