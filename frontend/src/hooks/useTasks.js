import { useState, useEffect, useCallback } from "react";
import { api } from "../api/tasks";

export function useTasks(filter) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTasks(filter);
      setTasks(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title) => {
    const res = await api.createTask(title);
    setTasks((prev) => [res.data, ...prev]);
    return res.data;
  };

  const toggleTask = async (id, completed) => {
    const res = await api.updateTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const editTask = async (id, title) => {
    const res = await api.updateTask(id, { title });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, addTask, toggleTask, editTask, removeTask, refetch: fetchTasks };
}
