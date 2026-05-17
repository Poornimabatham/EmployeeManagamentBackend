const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAdminSecret(toEmail) {
  await transporter.sendMail({
    from: `"Employee Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Admin Registration Secret Code",
    html: `
      <h2>Admin Registration Code</h2>
      <p>Use the following secret code to register as Admin:</p>
      <h1 style="color:#2196F3; letter-spacing:4px">${process.env.ADMIN_SECRET}</h1>
      <p>Do not share this code with anyone.</p>
    `,
  });
}

module.exports = { sendAdminSecret };
