/* =============================================
   GSD TO-DO APP - JavaScript (script.js)
   =============================================

   This file makes the to-do app work!
   It handles adding, deleting, completing, and saving tasks.

   HOW IT WORKS:
   1. We grab HTML elements using document.getElementById()
   2. We listen for user actions (clicks, key presses) with addEventListener()
   3. We store tasks in an array (a list of objects)
   4. We save/load tasks from localStorage so they survive page refreshes

   PREREQUISITES:
   - Basic JavaScript (variables, functions, arrays, objects)
   - Basic DOM manipulation (getElementById, innerHTML)
   - Understanding of events (click, submit)

   RESOURCES:
   - JavaScript Arrays: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   - DOM Manipulation: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
   - localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   - addEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

   ============================================= */


/* =============================================
   STEP 1: SELECT HTML ELEMENTS
   =============================================
   document.getElementById() finds an HTML element by its "id" attribute.
   We save each element in a variable so we can use it later.

   Example: <input id="taskInput"> in HTML
            → const taskInput = document.getElementById('taskInput') in JS
   ============================================= */

// The text input where users type new tasks
const taskInput = document.getElementById('taskInput');

// The "Add Task" button
const addTaskBtn = document.getElementById('addTaskBtn');

// The <ul> list where tasks will be displayed
const taskList = document.getElementById('taskList');

// The <span> elements that show task counts
const totalTasksSpan = document.getElementById('totalTasks');
const activeTasksSpan = document.getElementById('activeTasks');
const completedTasksSpan = document.getElementById('completedTasks');

// The filter buttons (All, Active, Completed)
const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');


/* =============================================
   STEP 2: CREATE THE TASKS ARRAY
   =============================================
   We store all tasks in an array. Each task is an object like:
   { id: 1234567890, text: "Buy groceries", completed: false }

   - id: a unique number so we can find/delete specific tasks
   - text: what the task says
   - completed: true or false (is it done?)
   ============================================= */

let tasks = [];


/* =============================================
   STEP 3: EVENT LISTENERS
   =============================================
   Event listeners "listen" for things the user does (clicks, key presses).
   When the event happens, they run a function.

   Syntax: element.addEventListener('eventName', functionToRun)

   STUDENT TASK: Uncomment these lines (remove the //) to activate the app!
   ============================================= */

// When the "Add Task" button is clicked, run the addTask function
// addTaskBtn.addEventListener('click', addTask);

// When the user presses Enter in the input field, run addTask
// taskInput.addEventListener('keypress', function(e) {
//    if (e.key === 'Enter') {
//       addTask();
//    }
// });

// When filter buttons are clicked, show filtered tasks
// filterAllBtn.addEventListener('click', function() { filterTasks('all'); });
// filterActiveBtn.addEventListener('click', function() { filterTasks('active'); });
// filterCompletedBtn.addEventListener('click', function() { filterTasks('completed'); });


/* =============================================
   STEP 4: CORE FUNCTIONS
   ============================================= */

/**
 * ADD A NEW TASK
 * This function runs when the user clicks "Add Task" or presses Enter.
 * It creates a new task object and adds it to our array.
 */
function addTask() {
   // Get what the user typed and remove extra spaces with .trim()
   const taskText = taskInput.value.trim();

   // If the input is empty, show an alert and stop
   if (taskText === '') {
      alert('Please enter a task!');
      return; // "return" exits the function early
   }

   // Create a new task object
   // Date.now() gives us a unique number (milliseconds since 1970)
   const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
   };

   // Add the new task to our array using .push()
   // .push() adds an item to the END of an array
   tasks.push(newTask);

   // Clear the input field so the user can type a new task
   taskInput.value = '';

   // Update what's shown on the page
   renderTasks();
   updateStatistics();

   // Save to localStorage so tasks survive page refreshes
   saveTasks();
}


/**
 * DELETE A TASK
 * Removes a task from the array by its id.
 * Uses .filter() to create a new array WITHOUT the deleted task.
 *
 * .filter() keeps items that return TRUE and removes items that return FALSE.
 * Example: [1,2,3].filter(n => n !== 2) → [1,3]
 */
function deleteTask(taskId) {
   // Keep all tasks EXCEPT the one with this id
   tasks = tasks.filter(function(task) {
      return task.id !== taskId;
   });

   // Update the page
   renderTasks();
   updateStatistics();
   saveTasks();
}


/**
 * TOGGLE TASK COMPLETE/INCOMPLETE
 * Finds a task by id and flips its "completed" status.
 * Uses .find() to locate the task in the array.
 *
 * .find() returns the FIRST item that matches a condition.
 * The ! operator flips true to false, or false to true.
 */
function toggleTask(taskId) {
   // Find the task with this id
   const task = tasks.find(function(task) {
      return task.id === taskId;
   });

   // If we found it, flip the completed status
   if (task) {
      task.completed = !task.completed; // true becomes false, false becomes true
   }

   // Update the page
   renderTasks();
   updateStatistics();
   saveTasks();
}


/**
 * RENDER (DISPLAY) TASKS ON THE PAGE
 * This function clears the task list and rebuilds it from our array.
 * It creates HTML elements using JavaScript and adds them to the page.
 *
 * @param {string} filter - "all", "active", or "completed"
 */
function renderTasks(filter = 'all') {
   // Clear everything currently in the list
   taskList.innerHTML = '';

   // Decide which tasks to show based on the filter
   let filteredTasks = tasks;
   if (filter === 'active') {
      filteredTasks = tasks.filter(function(task) { return !task.completed; });
   } else if (filter === 'completed') {
      filteredTasks = tasks.filter(function(task) { return task.completed; });
   }

   // If there are no tasks to show, display a message
   if (filteredTasks.length === 0) {
      taskList.innerHTML = '<li class="list-group-item text-center text-muted">No tasks yet. Add one above!</li>';
      return;
   }

   // Loop through each task and create an HTML list item
   filteredTasks.forEach(function(task) {
      // Create a new <li> element
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      // If the task is completed, add a CSS class to style it differently
      if (task.completed) {
         li.classList.add('task-completed');
      }

      // Set the HTML content inside the <li>
      // This includes a checkbox, the task text, and a delete button
      li.innerHTML = `
         <div>
            <input
               type="checkbox"
               class="form-check-input me-2"
               ${task.completed ? 'checked' : ''}
               onchange="toggleTask(${task.id})">
            <span style="${task.completed ? 'text-decoration: line-through; color: #999;' : ''}">${task.text}</span>
         </div>
         <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
            Delete
         </button>
      `;

      // Add the <li> to the <ul> list
      taskList.appendChild(li);
   });
}


/**
 * UPDATE STATISTICS
 * Counts total, active, and completed tasks.
 * Then updates the numbers shown on the page.
 */
function updateStatistics() {
   const total = tasks.length;
   const completed = tasks.filter(function(task) { return task.completed; }).length;
   const active = total - completed;

   // Update the text content of each span
   totalTasksSpan.textContent = total;
   activeTasksSpan.textContent = active;
   completedTasksSpan.textContent = completed;
}


/* =============================================
   STEP 5: LOCAL STORAGE
   =============================================
   localStorage lets us save data in the browser.
   Data stays even after closing the browser!

   We can only save STRINGS in localStorage, so we use:
   - JSON.stringify() to convert our array → string (for saving)
   - JSON.parse() to convert the string → array (for loading)

   Learn more: https://www.w3schools.com/js/js_json_stringify.asp
   ============================================= */

/**
 * SAVE TASKS to localStorage
 */
function saveTasks() {
   // Convert the tasks array to a JSON string and save it
   localStorage.setItem('gsdTasks', JSON.stringify(tasks));
}

/**
 * LOAD TASKS from localStorage
 */
function loadTasks() {
   // Try to get saved tasks from localStorage
   const savedTasks = localStorage.getItem('gsdTasks');

   // If there are saved tasks, parse them back into an array
   if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      renderTasks();
      updateStatistics();
   }
}


/* =============================================
   STEP 6: FILTER FUNCTIONS
   =============================================
   These let the user show only certain tasks.
   ============================================= */

/**
 * FILTER TASKS by status (all, active, or completed)
 * Also highlights the active filter button.
 */
function filterTasks(filter) {
   // Remove "active" class from all filter buttons
   document.querySelectorAll('.btn-group .btn').forEach(function(btn) {
      btn.classList.remove('active');
   });

   // Add "active" class to the clicked button
   if (filter === 'all') {
      filterAllBtn.classList.add('active');
   } else if (filter === 'active') {
      filterActiveBtn.classList.add('active');
   } else if (filter === 'completed') {
      filterCompletedBtn.classList.add('active');
   }

   // Re-render tasks with the selected filter
   renderTasks(filter);
}


/* =============================================
   STEP 7: INITIALIZE THE APP
   =============================================
   DOMContentLoaded fires when the HTML is fully loaded.
   This is where we load saved tasks from localStorage.

   STUDENT TASK: Uncomment these lines to make tasks persist!
   ============================================= */

// document.addEventListener('DOMContentLoaded', function() {
//    loadTasks();
//    filterAllBtn.classList.add('active');
// });


/* =============================================
   BONUS CHALLENGES (for extra practice!)
   =============================================

   1. ADD AN EDIT BUTTON - Let users change the text of a task
   2. ADD CATEGORIES - Let users tag tasks (work, personal, school)
   3. ADD DUE DATES - Use <input type="date"> for deadlines
   4. CLEAR COMPLETED - Add a button to delete all completed tasks
   5. TASK SEARCH - Add a search bar to find specific tasks
   6. DRAG AND DROP - Let users reorder tasks by dragging
   7. DARK MODE - Add a button to toggle dark/light theme
   8. SOUND EFFECTS - Play a sound when a task is completed
   9. ANIMATIONS - Add fade-in/fade-out when adding/deleting tasks
   10. CONNECT TO SERVER - Use fetch() to save tasks on the backend
       (We will do this in a future lesson!)

   ============================================= */
