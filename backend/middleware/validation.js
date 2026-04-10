/**
 * Validates the body of a POST /tasks request.
 */
function validateCreateTask(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "title is required and must be a non-empty string." });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ error: "title must not exceed 200 characters." });
  }

  next();
}

/**
 * Validates the body of a PATCH /tasks/:id request.
 */
function validateUpdateTask(req, res, next) {
  const { completed, title } = req.body;

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean." });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "title must be a non-empty string." });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ error: "title must not exceed 200 characters." });
    }
  }

  if (completed === undefined && title === undefined) {
    return res.status(400).json({ error: "At least one of 'title' or 'completed' must be provided." });
  }

  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
