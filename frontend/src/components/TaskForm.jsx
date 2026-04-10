import { useState } from "react";

export function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAdd(trimmed);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__row">
        <input
          className="task-form__input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          disabled={submitting}
          aria-label="New task title"
        />
        <button className="task-form__btn" type="submit" disabled={submitting || !title.trim()}>
          {submitting ? "Adding…" : "Add Task"}
        </button>
      </div>
      {error && <p className="task-form__error">{error}</p>}
    </form>
  );
}
