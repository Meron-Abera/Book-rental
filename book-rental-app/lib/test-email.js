require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "meronabera2121@gmail.com",
    pass: process.env.EMAIL_PASS || "fezv qrkk zoaf xagf",
  },
  debug: true,  
  logger: true  
});

const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "meronabera2121@gmail.com",
      to: 'kynthia369@gmail.com',
      subject: 'Test Email',
      text: 'Hello world!',
    });
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

testEmail();
