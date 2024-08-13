import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';
import nodemailer from 'nodemailer';
import { signToken } from '../../../../utils/jwt';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "meronabera2121@gmail.com",
    pass: process.env.EMAIL_PASS || "fezv qrkk zoaf xagf",
  },
  debug: true, 
  logger: true  
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password, confirmPassword, location, phoneNumber, termsAccepted } = req.body;

  if (!email || !password || !confirmPassword || !location || !phoneNumber || termsAccepted === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'pending'; 

    await query(
      'INSERT INTO users (email, password, location, phone_number, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [email, hashedPassword, location, phoneNumber, role, 'pending']
    );

    const adminEmail = process.env.ADMIN_EMAIL||"kunthia369@gmail.com";
    const registrationLink = `${process.env.APP_URL}/approve-user?email=${encodeURIComponent(email)}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER||'meronabera2121@gmail.com',
      to: adminEmail,
      subject: 'New User Registration',
      html: `<p>A new user has registered and is awaiting approval.</p><p>Click <a href="${registrationLink}">here</a> to approve or reject the user.</p>`,
    });

    res.status(201).json({ message: 'User registered successfully. Awaiting approval.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}
