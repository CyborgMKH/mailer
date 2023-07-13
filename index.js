const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const limiter = require("./express-rate-limit");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.post("/api/v1/send-email", (req, res) => {
  // Extract the form data
  const { name, email, message } = req.body;

  // Create a transporter using Zoho Mail SMTP settings
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  // Compose the email message
  const mailOptions = {
    from: email,
    to: process.env.USER_EMAIL,
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while sending the email." });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully." });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
