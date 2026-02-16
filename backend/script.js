/* =============================================
   GSD APP - BACKEND SERVER (backend/script.js)
   =============================================

   This is a simple web server built with Node.js and Express.
   It creates an API (Application Programming Interface) that
   the frontend can talk to.

   RIGHT NOW: This server works but the frontend doesn't use it yet.
   The dashboard saves tasks to localStorage (in the browser) instead.

   LATER: We will connect the frontend to this server using fetch(),
   so tasks are saved on the server instead of just in the browser.

   WHAT YOU'LL LEARN:
   - What a web server is and how it works
   - How to create API endpoints (routes)
   - What CRUD means (Create, Read, Update, Delete)
   - How HTTP methods work (GET, POST, PUT, DELETE)
   - How to use Express.js

   HOW TO RUN THIS SERVER:
   1. Open your terminal
   2. Navigate to the backend folder: cd backend
   3. Install dependencies: npm install
   4. Start the server: node script.js
   5. Open your browser to: http://localhost:3000/todos

   RESOURCES:
   - Express.js Guide: https://expressjs.com/en/starter/hello-world.html
   - HTTP Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   - What is an API: https://www.w3schools.com/js/js_api_intro.asp
   - What is REST: https://developer.mozilla.org/en-US/docs/Glossary/REST

   ============================================= */


/* =============================================
   STEP 1: IMPORT PACKAGES
   =============================================
   require() loads packages (libraries) that other people wrote.
   We installed these with "npm install" (see package.json).

   - express: A framework that makes it easy to build web servers
   - cors: Allows our frontend (on a different port) to talk to this server
   ============================================= */
const express = require('express');
const cors = require('cors');


/* =============================================
   STEP 2: CREATE THE APP
   =============================================
   express() creates our web application.
   Think of it as starting up a restaurant - the app is the restaurant itself.
   ============================================= */
const app = express();


/* =============================================
   STEP 3: MIDDLEWARE
   =============================================
   Middleware runs BEFORE our routes handle requests.
   Think of it like a receptionist that prepares things before you meet the manager.

   - cors() lets the frontend (different origin/port) make requests to this server
   - express.json() lets the server understand JSON data sent in request bodies
   ============================================= */
app.use(cors());
app.use(express.json());


/* =============================================
   STEP 4: FAKE DATABASE
   =============================================
   In a real app, we'd use a database (like MongoDB or PostgreSQL).
   For now, we just use a regular JavaScript array.

   NOTE: This data resets every time you restart the server!
   That's because it's stored in memory, not in a real database.
   ============================================= */
let todos = [
  { id: 1, title: 'Buy iced coffee', done: false },
  { id: 2, title: 'Build my CRUD app', done: false },
];


/* =============================================
   STEP 5: API ROUTES (CRUD Operations)
   =============================================
   Each route handles a different type of request.
   This is called CRUD:

   C = Create → POST   (add new data)
   R = Read   → GET    (get existing data)
   U = Update → PUT    (change existing data)
   D = Delete → DELETE  (remove data)

   Each route has:
   - An HTTP method (get, post, put, delete)
   - A URL path ("/todos", "/todos/:id")
   - A handler function (req, res) => { ... }

   req = the REQUEST (what the client sent us)
   res = the RESPONSE (what we send back)
   ============================================= */


/* ----- READ: Get all todos ----- */
/* When someone visits http://localhost:3000/todos, send back all todos */
app.get('/todos', function(req, res) {
  res.json(todos); // .json() sends data as JSON
});


/* ----- CREATE: Add a new todo ----- */
/* When someone sends a POST request to /todos with a title, create a new todo */
app.post('/todos', function(req, res) {
  // Create a new todo object
  const newTodo = {
    id: todos.length + 1,      // Simple way to make a unique id
    title: req.body.title,      // Get the title from the request body
    done: false                 // New todos start as not done
  };

  // Add it to our array
  todos.push(newTodo);

  // Send back the new todo with status 201 (Created)
  res.status(201).json(newTodo);
});


/* ----- UPDATE: Mark a todo as done/undone ----- */
/* The :id in the URL is a parameter - it changes based on which todo we want */
/* Example: PUT /todos/1 → update todo with id 1 */
app.put('/todos/:id', function(req, res) {
  // Get the id from the URL and convert it to a number
  const id = parseInt(req.params.id);

  // Find the todo with this id
  const todo = todos.find(function(t) { return t.id === id; });

  // If we didn't find it, send a 404 (Not Found) error
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  // Update the "done" status from the request body
  todo.done = req.body.done;

  // Send back the updated todo
  res.json(todo);
});


/* ----- DELETE: Remove a todo ----- */
/* Example: DELETE /todos/1 → delete todo with id 1 */
app.delete('/todos/:id', function(req, res) {
  // Get the id from the URL
  const id = parseInt(req.params.id);

  // Filter out (remove) the todo with this id
  todos = todos.filter(function(t) { return t.id !== id; });

  // Send back a success message
  res.json({ message: 'Todo deleted' });
});


/* =============================================
   STEP 6: START THE SERVER
   =============================================
   This tells the server to start listening for requests
   on port 3000. Like opening the doors to the restaurant!

   After running "node script.js" you'll see the message
   in your terminal, and can visit http://localhost:3000/todos
   ============================================= */
const PORT = 3000;

app.listen(PORT, function() {
  console.log('--------------------------------------------');
  console.log('  GSD Server is running!');
  console.log('  Open: http://localhost:' + PORT + '/todos');
  console.log('--------------------------------------------');
});
