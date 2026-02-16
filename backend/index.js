// Import required packages
const express = require("express");
const cors = require("cors");

// Create the app
const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Allow server to read JSON bodies

// Fake database (in memory)
let todos = [
	{ id: 1, title: "Buy iced coffee", done: false },
	{ id: 2, title: "Build my CRUD app", done: false },
];

// =====================
// READ - Get all todos
// =====================
app.get("/todos", (req, res) => {
	res.json(todos);
});

// =====================
// CREATE - Add a todo
// =====================
app.post("/todos", (req, res) => {
	const newTodo = {
		id: todos.length + 1,
		title: req.body.title,
		done: false,
	};

	todos.push(newTodo);
	res.status(201).json(newTodo);
});

// =====================
// UPDATE - Mark done
// =====================
app.put("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	const todo = todos.find((t) => t.id === id);

	if (!todo) {
		return res.status(404).json({ message: "Todo not found" });
	}

	todo.done = req.body.done;
	res.json(todo);
});

// =====================
// DELETE - Remove todo
// =====================
app.delete("/todos/:id", (req, res) => {
	const id = parseInt(req.params.id);
	todos = todos.filter((t) => t.id !== id);

	res.json({ message: "Todo deleted" });
});

// Start server
const port = 3000;

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
