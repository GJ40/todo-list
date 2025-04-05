// Getting references to DOM elements
const taskInput = document.getElementById("taskInput");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clear = document.querySelector(".filters .clear-btn");

// Getting the To-Do list from localStorage, if it exists
let todos = JSON.parse(localStorage.getItem("todo-list"));

// Declaring variables for editing tasks
let editId;
let isEditedTask = false;

// Adding event listeners to filter buttons (All, Pending, Completed)
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove the active class from the currently active filter
        document.querySelector("span.active").classList.remove("active");
        // Add the active class to the clicked filter
        btn.classList.add("active");
        // Show tasks based on the selected filter
        showList(btn.id);
    });
});

// Function to clear all tasks from the list
function clearAll() {
    todos.splice(0, todos.length); // Remove all tasks from the array
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Save changes to localStorage
    showList("all"); // Update the list view
}

// Function to display the task list based on selected filter
function showList(filter) {
    let li = ``;
    if (todos) {
        todos.forEach((task, id) => {
            // If the task is completed, set the checked class
            let isCompleted = task.status === "completed" ? "checked" : "";

            // Only display tasks matching the filter (All, Pending, or Completed)
            if (filter == task.status || filter == "all") {
                li += `
                    <li class="task">
                        <label for="${id}">
                            <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${isCompleted}>
                            <p class="${isCompleted}">${task.name}</p>
                        </label>
                        <div class="settings">
                            <button onclick="editTask(${id}, '${task.name}')" class="edit-btn"><i class="material-icons">edit</i></button>
                            <button onclick="deleteTask(${id})" class="del-btn"><i class="material-icons">delete</i></button>
                        </div>
                    </li>
                `;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't have any task.</span>`; // If no tasks, show a message
}
showList("all"); // Initially show all tasks

// Function to edit a task
function editTask(taskId, taskName) {
    editId = taskId; // Store the task ID to edit
    isEditedTask = true; // Flag to indicate editing mode
    taskInput.value = taskName; // Populate input field with the task name
}

// Function to delete a task
function deleteTask(taskId) {
    todos.splice(taskId, 1); // Remove task from the array
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Save changes to localStorage
    showList("all"); // Update the list view
}

// Function to update the status of a task (completed or pending)
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild; // Get the task name element
    if (selectedTask.checked) {
        taskName.classList.add("checked"); // Add checked class for completed tasks
        todos[selectedTask.id].status = "completed"; // Update status to completed
    } else {
        taskName.classList.remove("checked"); // Remove checked class for pending tasks
        todos[selectedTask.id].status = "pending"; // Update status to pending
    }
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Save changes to localStorage
}

// Function to add a new task
function addTask() {
    let userTask = taskInput.value.trim(); // Get and clean up user input
    if (!userTask) {
        alert("Please Enter the Task"); // If input is empty, show an alert
        return;
    }

    if (!isEditedTask) {
        // If not editing, create a new task object and add it to the list
        if (!todos) {
            todos = [];
        }
        let task = {
            name: userTask,
            status: "pending", // Default status is 'pending'
        };
        todos.push(task); // Add new task to todos
    } else {
        isEditedTask = false; // Reset the editing flag
        todos[editId].name = userTask; // Update the task name
    }

    taskInput.value = ""; // Clear the input field
    localStorage.setItem("todo-list", JSON.stringify(todos)); // Save the updated list to localStorage
    showList("all"); // Update the list view
}
