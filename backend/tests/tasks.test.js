const request = require("supertest");
const app = require("../server");

describe("Task API", () => {
  let createdId;

  describe("GET /tasks", () => {
    it("returns 200 with an array of tasks", async () => {
      const res = await request(app).get("/tasks");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("filters completed tasks", async () => {
      const res = await request(app).get("/tasks?filter=completed");
      expect(res.status).toBe(200);
      res.body.data.forEach((t) => expect(t.completed).toBe(true));
    });

    it("filters incomplete tasks", async () => {
      const res = await request(app).get("/tasks?filter=incomplete");
      expect(res.status).toBe(200);
      res.body.data.forEach((t) => expect(t.completed).toBe(false));
    });
  });

  describe("POST /tasks", () => {
    it("creates a task and returns 201", async () => {
      const res = await request(app).post("/tasks").send({ title: "Test task" });
      expect(res.status).toBe(201);
      expect(res.body.data).toMatchObject({ title: "Test task", completed: false });
      createdId = res.body.data.id;
    });

    it("returns 400 when title is missing", async () => {
      const res = await request(app).post("/tasks").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when title is empty string", async () => {
      const res = await request(app).post("/tasks").send({ title: "   " });
      expect(res.status).toBe(400);
    });

    it("returns 400 when title exceeds 200 characters", async () => {
      const res = await request(app).post("/tasks").send({ title: "a".repeat(201) });
      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("marks a task as completed", async () => {
      const res = await request(app).patch(`/tasks/${createdId}`).send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    it("updates a task title", async () => {
      const res = await request(app).patch(`/tasks/${createdId}`).send({ title: "Updated title" });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Updated title");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app).patch("/tasks/nonexistent").send({ completed: true });
      expect(res.status).toBe(404);
    });

    it("returns 400 when body has no valid fields", async () => {
      const res = await request(app).patch(`/tasks/${createdId}`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("deletes a task and returns 200", async () => {
      const res = await request(app).delete(`/tasks/${createdId}`);
      expect(res.status).toBe(200);
    });

    it("returns 404 for already-deleted task", async () => {
      const res = await request(app).delete(`/tasks/${createdId}`);
      expect(res.status).toBe(404);
    });
  });
});
