import { useState } from "react";

export function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    setBusy(true);
    try {
      await onToggle(task.id, !task.completed);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEditSave = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === task.title) {
      setEditing(false);
      setEditTitle(task.title);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onEdit(task.id, trimmed);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") {
      setEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const date = new Date(task.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <li className={`task-item${task.completed ? " task-item--done" : ""}${busy ? " task-item--busy" : ""}`}>
      <button
        className="task-item__check"
        onClick={handleToggle}
        disabled={busy}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        title={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed ? (
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      <div className="task-item__body">
        {editing ? (
          <input
            className="task-item__edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={handleEditKeyDown}
            maxLength={200}
            autoFocus
            disabled={busy}
          />
        ) : (
          <span
            className="task-item__title"
            onDoubleClick={() => { setEditing(true); setEditTitle(task.title); }}
            title="Double-click to edit"
          >
            {task.title}
          </span>
        )}
        <span className="task-item__date">{date}</span>
        {error && <span className="task-item__error">{error}</span>}
      </div>

      <div className="task-item__actions">
        {!editing && (
          <button
            className="task-item__btn task-item__btn--edit"
            onClick={() => { setEditing(true); setEditTitle(task.title); }}
            disabled={busy}
            aria-label="Edit task"
            title="Edit"
          >
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 2.5l3 3L6 17H3v-3L14.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          className="task-item__btn task-item__btn--delete"
          onClick={handleDelete}
          disabled={busy}
          aria-label="Delete task"
          title="Delete"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
