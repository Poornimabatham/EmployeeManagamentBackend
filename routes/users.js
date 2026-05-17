// backend/routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyToken, adminOnly } = require("../middleware/auth");

// Employee: get own profile
router.get("/profile", verifyToken, (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users WHERE email = ?",
    [req.user.email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results[0]);
    },
  );
});

// Admin: get all employees
router.get("/all", verifyToken, adminOnly, (req, res) => {
  db.query(
    "SELECT id, name, email, role, created_at FROM users",
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    },
  );
});

module.exports = router;
