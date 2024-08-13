const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || "meronabera2121@gmail.com",
      pass: process.env.EMAIL_PASS || "fezv qrkk zoaf xagf",
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });
  

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "meronabera2121@gmail.com",
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
