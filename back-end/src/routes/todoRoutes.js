const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

// GET /api/todos - Get paginated todos
router.get('/', todoController.getTodos);

// POST /api/todos - Create a new todo
router.post('/', todoController.createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/:id', todoController.updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;

