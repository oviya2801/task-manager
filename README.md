# Task Manager

A full-stack Task Manager application built with **React** (frontend) and **Node.js / Express** (backend).

---

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React 18, CSS (custom)  |
| Backend  | Node.js, Express 4      |
| Storage  | In-memory (no database) |
| Testing  | Jest + Supertest        |
| Docker   | Docker Compose          |

---

## Project Structure

```
task-manager/
├── backend/
│   ├── middleware/
│   │   └── validation.js     # Request validation middleware
│   ├── routes/
│   │   └── tasks.js          # Task route handlers
│   ├── tests/
│   │   └── tasks.test.js     # API integration tests
│   ├── server.js             # Express app entry point
│   ├── store.js              # In-memory data store
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js      # API client
│   │   ├── components/
│   │   │   ├── FilterBar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskItem.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js   # Data-fetching hook
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Local — no Docker)

### Prerequisites
- Node.js 18+
- npm

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# API runs at http://localhost:4000
```

For development with auto-reload:
```bash
npm run dev
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

The React dev server proxies `/tasks` requests to `http://localhost:4000` automatically (configured in `package.json`).

---

## Docker Setup

### Prerequisites
- Docker and Docker Compose installed

### Run everything with one command

```bash
docker-compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:4000  |

To stop:
```bash
docker-compose down
```

---

## API Reference

Base URL: `http://localhost:4000`

### `GET /tasks`
Returns all tasks.

**Query params:**
- `?filter=completed` — only completed tasks
- `?filter=incomplete` — only incomplete tasks

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### `POST /tasks`
Create a new task.

**Body:**
```json
{ "title": "Buy groceries" }
```

**Validation:**
- `title` is required, must be a non-empty string, max 200 characters.

**Response:** `201 Created`
```json
{ "data": { "id": "uuid", "title": "Buy groceries", "completed": false, "createdAt": "..." } }
```

---

### `PATCH /tasks/:id`
Update a task's title and/or completed status.

**Body (at least one field required):**
```json
{ "completed": true }
{ "title": "Updated title" }
{ "completed": true, "title": "Updated title" }
```

**Response:** `200 OK`
```json
{ "data": { ...updatedTask } }
```

---

### `DELETE /tasks/:id`
Delete a task.

**Response:** `200 OK`
```json
{ "message": "Task deleted successfully." }
```

---

## Running Tests

```bash
cd backend
npm install
npm test
```

Tests cover:
- `GET /tasks` — list, filter by completed/incomplete
- `POST /tasks` — success, missing title, empty title, title too long
- `PATCH /tasks/:id` — toggle, edit title, 404, empty body
- `DELETE /tasks/:id` — success, 404 on repeat delete

---

## Features

### Core
- [x] View all tasks
- [x] Add a new task (with validation)
- [x] Mark a task complete / incomplete
- [x] Delete a task
- [x] Loading and error states

### Bonus
- [x] Filter tasks by All / Active / Done
- [x] Edit task title inline (double-click)
- [x] Basic API integration tests
- [x] Docker Compose setup

---

## Assumptions & Trade-offs

- **In-memory storage**: Tasks are reset on server restart. This was chosen deliberately to avoid database setup overhead within the time constraint. Swapping in SQLite or Postgres would require only changes to `store.js`.

- **No auth**: The assignment scope does not include authentication. All users share the same task list.

- **Filter counts**: The filter badge counts always reflect the full unfiltered dataset. This requires a second `useTasks("all")` hook instance in `App.jsx`. A shared context or a single endpoint returning counts would be cleaner at scale.

- **No pagination**: Acceptable given the exercise scope.

- **CSS only, no UI library**: Keeps bundle size minimal and demonstrates raw CSS ability. A design system (e.g., Radix UI) would be preferable in a production codebase.
