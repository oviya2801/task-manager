const express = require("express");
const router = express.Router();
const TaskStore = require("../store");
const { validateCreateTask, validateUpdateTask } = require("../middleware/validation");

router.get("/", (req, res) => {
  let tasks = TaskStore.getAll();

  const { filter } = req.query;
  if (filter === "completed") {
    tasks = tasks.filter((t) => t.completed);
  } else if (filter === "incomplete") {
    tasks = tasks.filter((t) => !t.completed);
  }

  res.json({ data: tasks, count: tasks.length });
});


router.post("/", validateCreateTask, (req, res) => {
  const { title } = req.body;
  const task = TaskStore.create(title);
  res.status(201).json({ data: task });
});


router.patch("/:id", validateUpdateTask, (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;

  const fields = {};
  if (completed !== undefined) fields.completed = completed;
  if (title !== undefined) fields.title = title.trim();

  const updated = TaskStore.update(id, fields);
  if (!updated) {
    return res.status(404).json({ error: `Task with id '${id}' not found.` });
  }

  res.json({ data: updated });
});


router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleted = TaskStore.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: `Task with id '${id}' not found.` });
  }

  res.status(200).json({ message: "Task deleted successfully." });
});

module.exports = router;
