import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { FilterBar } from "./components/FilterBar";
import "./App.css";

export default function App() {
  const [filter, setFilter] = useState("all");

  // Single source of truth: always fetch all tasks, filter client-side.
  // This keeps counts accurate after any mutation without a second hook.
  const { tasks: allTasks, loading, error, addTask, toggleTask, editTask, removeTask } = useTasks("all");

  const tasks =
    filter === "completed"
      ? allTasks.filter((t) => t.completed)
      : filter === "incomplete"
      ? allTasks.filter((t) => !t.completed)
      : allTasks;

  const counts = {
    all: allTasks.length,
    incomplete: allTasks.filter((t) => !t.completed).length,
    completed: allTasks.filter((t) => t.completed).length,
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-inner">
          <span className="app__logo">✦</span>
          <h1 className="app__title">Task Manager</h1>
          <p className="app__subtitle">Stay organised, ship faster</p>
        </div>
      </header>

      <main className="app__main">
        <TaskForm onAdd={addTask} />

        <FilterBar filter={filter} onChange={setFilter} counts={counts} />

        <section className="task-list-section" aria-label="Task list">
          {loading && (
            <div className="state-message state-message--loading">
              <span className="spinner" />
              Loading tasks…
            </div>
          )}

          {error && !loading && (
            <div className="state-message state-message--error">
              ⚠ {error}
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="state-message state-message--empty">
              {filter === "all"
                ? "No tasks yet — add one above."
                : filter === "completed"
                ? "No completed tasks."
                : "No active tasks. Well done!"}
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <ul className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={editTask}
                  onDelete={removeTask}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
