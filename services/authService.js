const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { sendAdminSecret } = require("../services/emailService");

async function register({
  name,
  email,
  password,
  role = "employee",
  adminSecret,
}) {
  const exists = await queryOne("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (exists) throw new Error("User already exists");

  if (role === "admin") {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      throw new Error("Invalid admin secret code");
    }
  }

  const hashed = await bcrypt.hash(password, 10);
  await queryRun(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashed, role],
  );
  return { message: `Registered successfully as ${role}` };
}

async function login({ email, password }) {
  const user = await queryOne("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  return { token, name: user.name, role: user.role };
}
async function sendAdminCode(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    await sendAdminSecret(email);
    res.json({ message: `Admin secret code sent to ${email}` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
}


function queryOne(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results[0] || null);
    });
  });
}

function queryRun(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

module.exports = { register, login, sendAdminCode };
