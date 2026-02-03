/* ============================================
   GSD TO-DO APP - STUDENT STARTER JAVASCRIPT
   ============================================
   
   INSTRUCTIONS FOR STUDENTS:
   This file contains the starter code and comments to guide you
   in building your to-do app functionality.
   
   YOUR TASKS:
   1. Select DOM elements (buttons, inputs, lists)
   2. Add event listeners for user interactions
   3. Create functions to add, delete, and toggle tasks
   4. Update the task statistics (total, active, completed)
   5. Implement localStorage to persist tasks
   6. (Optional) Add filter functionality
   
   TIP: Work through each section step by step!
   ============================================ */

/* ============================================
   STEP 1: SELECT DOM ELEMENTS
   Get references to HTML elements you'll need
   ============================================ */

// TODO: Select the input field where users type new tasks
const taskInput = document.getElementById('taskInput');

// TODO: Select the "Add Task" button
const addTaskBtn = document.getElementById('addTaskBtn');

// TODO: Select the task list (ul element)
const taskList = document.getElementById('taskList');

// TODO: Select the statistics spans
const totalTasksSpan = document.getElementById('totalTasks');
const activeTasksSpan = document.getElementById('activeTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// TODO: Select filter buttons (optional feature)
const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');


/* ============================================
   STEP 2: INITIALIZE DATA STRUCTURE
   Create an array to store your tasks
   ============================================ */

// TODO: Create an array to store all tasks
let tasks = [];

// Each task should be an object with properties like:
// { id: unique number, text: 'task description', completed: false }


/* ============================================
   STEP 3: ADD EVENT LISTENERS
   Set up listeners for user interactions
   ============================================ */

// TODO: Add click event listener to the "Add Task" button
// addTaskBtn.addEventListener('click', addTask);

// TODO: Add keypress event listener to input (Enter key)
// taskInput.addEventListener('keypress', (e) => {
//    if (e.key === 'Enter') {
//       addTask();
//    }
// });

// TODO: Add event listeners for filter buttons (optional)
// filterAllBtn.addEventListener('click', () => filterTasks('all'));
// filterActiveBtn.addEventListener('click', () => filterTasks('active'));
// filterCompletedBtn.addEventListener('click', () => filterTasks('completed'));


/* ============================================
   STEP 4: CREATE CORE FUNCTIONS
   ============================================ */

/**
 * Add a new task to the list
 * TODO: Complete this function
 */
function addTask() {
   // Get the input value
   const taskText = taskInput.value.trim();
   
   // Validate: Check if input is not empty
   if (taskText === '') {
      alert('Please enter a task!');
      return;
   }
   
   // Create a task object
   const newTask = {
      id: Date.now(), // Use timestamp as unique ID
      text: taskText,
      completed: false
   };
   
   // Add task to array
   tasks.push(newTask);
   
   // Clear input field
   taskInput.value = '';
   
   // Update the display
   renderTasks();
   updateStatistics();
   
   // Save to localStorage
   saveTasks();
}


/**
 * Delete a task by ID
 * TODO: Complete this function
 */
function deleteTask(taskId) {
   // Remove task from array
   tasks = tasks.filter(task => task.id !== taskId);
   
   // Update display
   renderTasks();
   updateStatistics();
   
   // Save to localStorage
   saveTasks();
}


/**
 * Toggle task completion status
 * TODO: Complete this function
 */
function toggleTask(taskId) {
   // Find the task and toggle its completed status
   const task = tasks.find(task => task.id === taskId);
   if (task) {
      task.completed = !task.completed;
   }
   
   // Update display
   renderTasks();
   updateStatistics();
   
   // Save to localStorage
   saveTasks();
}


/**
 * Render all tasks to the DOM
 * TODO: Complete this function
 */
function renderTasks(filter = 'all') {
   // Clear the current list
   taskList.innerHTML = '';
   
   // Filter tasks based on the current filter
   let filteredTasks = tasks;
   if (filter === 'active') {
      filteredTasks = tasks.filter(task => !task.completed);
   } else if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
   }
   
   // If no tasks, show a message
   if (filteredTasks.length === 0) {
      taskList.innerHTML = '<li class="list-group-item text-center text-muted">No tasks yet. Add one above!</li>';
      return;
   }
   
   // Loop through tasks and create list items
   filteredTasks.forEach(task => {
      // Create list item
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      // Add completed class if task is done
      if (task.completed) {
         li.classList.add('task-completed');
      }
      
      // Create checkbox and text
      li.innerHTML = `
         <div>
            <input 
               type="checkbox" 
               class="form-check-input me-2" 
               ${task.completed ? 'checked' : ''}
               onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
         </div>
         <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
            Delete
         </button>
      `;
      
      // Append to list
      taskList.appendChild(li);
   });
}


/**
 * Update task statistics
 * TODO: Complete this function
 */
function updateStatistics() {
   const total = tasks.length;
   const completed = tasks.filter(task => task.completed).length;
   const active = total - completed;
   
   totalTasksSpan.textContent = total;
   activeTasksSpan.textContent = active;
   completedTasksSpan.textContent = completed;
}


/* ============================================
   STEP 5: LOCALSTORAGE FUNCTIONS
   Save and load tasks from browser storage
   ============================================ */

/**
 * Save tasks to localStorage
 * TODO: Complete this function
 */
function saveTasks() {
   localStorage.setItem('gsdTasks', JSON.stringify(tasks));
}


/**
 * Load tasks from localStorage
 * TODO: Complete this function
 */
function loadTasks() {
   const savedTasks = localStorage.getItem('gsdTasks');
   if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      renderTasks();
      updateStatistics();
   }
}


/* ============================================
   STEP 6: FILTER FUNCTIONS (OPTIONAL)
   ============================================ */

/**
 * Filter tasks by status
 * TODO: Implement this function (optional enhancement)
 */
function filterTasks(filter) {
   // Update active button
   document.querySelectorAll('.btn-group .btn').forEach(btn => {
      btn.classList.remove('active');
   });
   
   if (filter === 'all') {
      filterAllBtn.classList.add('active');
   } else if (filter === 'active') {
      filterActiveBtn.classList.add('active');
   } else if (filter === 'completed') {
      filterCompletedBtn.classList.add('active');
   }
   
   // Re-render with filter
   renderTasks(filter);
}


/* ============================================
   STEP 7: INITIALIZE APP
   Load tasks when page loads
   ============================================ */

// TODO: Load tasks from localStorage when page loads
// document.addEventListener('DOMContentLoaded', () => {
//    loadTasks();
//    filterAllBtn.classList.add('active');
// });


/* ============================================
   BONUS CHALLENGES FOR ADVANCED STUDENTS
   ============================================
   
   1. Add an "Edit" button to modify existing tasks
   2. Add categories or tags to tasks
   3. Add due dates with a date picker
   4. Implement drag-and-drop to reorder tasks
   5. Add priority levels (high, medium, low)
   6. Create a "Clear All Completed" button
   7. Add task search functionality
   8. Implement undo/redo functionality
   9. Add sound effects or animations
   10. Connect to a backend API to save tasks to a database
   
   ============================================ */