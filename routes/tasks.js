// backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, adminOnly } = require("../middleware/auth");

router.post("/assign", verifyToken, adminOnly, (req, res) => {
  const { title, description, assigned_to, priority, start_date, due_date } =
    req.body;

  // First get both admin id and employee id
  db.query(
    "SELECT id, email FROM users WHERE email IN (?, ?)",
    [req.user.email, assigned_to],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "DB error", error: err.message });

      const adminUser = results.find((u) => u.email === req.user.email);
      const empUser = results.find((u) => u.email === assigned_to);

      if (!adminUser || !empUser)
        return res.status(404).json({ message: "User not found" });

      db.query(
        "INSERT INTO tasks (title, description, assigned_by, assigned_to, priority, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)",
        [
          title,
          description,
          adminUser.id,
          empUser.id,
          priority,
          start_date,
          due_date,
        ],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "DB error", error: err.message });
          res.json({ message: "Task assigned successfully" });
        },
      );
    },
  );
});

module.exports = router;
