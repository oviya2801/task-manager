const BASE_URL = process.env.REACT_APP_API_URL || "/tasks";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return body;
}

export const api = {
  getTasks: (filter) => {
    const query = filter && filter !== "all" ? `?filter=${filter}` : "";
    return request(query);
  },

  createTask: (title) =>
    request("", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  updateTask: (id, fields) =>
    request(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),

  deleteTask: (id) =>
    request(`/${id}`, {
      method: "DELETE",
    }),
};
