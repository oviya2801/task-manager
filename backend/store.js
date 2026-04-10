const { v4: uuidv4 } = require("uuid");

// In-memory store — seeded with a couple of example tasks
let tasks = [
  {
    id: uuidv4(),
    title: "Review project requirements",
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: uuidv4(),
    title: "Set up development environment",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const TaskStore = {
  getAll() {
    return tasks;
  },

  getById(id) {
    return tasks.find((t) => t.id === id) || null;
  },

  create(title) {
    const task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  update(id, fields) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...fields };
    return tasks[index];
  },

  delete(id) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },
};

module.exports = TaskStore;
