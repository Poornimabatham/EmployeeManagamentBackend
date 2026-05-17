const authService = require("../services/authService");
const { sendAdminSecret } = require("../services/emailService");

async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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


module.exports = { register, login, sendAdminCode };
