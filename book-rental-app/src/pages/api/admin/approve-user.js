import nodemailer from 'nodemailer';
import { query } from '../../../../lib/db';
import { signToken } from '../../../../utils/jwt';

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER||"meronabera2121@gmail.com",
    pass: process.env.EMAIL_PASS||"fezv qrkk zoaf xagf",
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, action } = req.body;

  if (!email || !action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const user = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user.rows[0].id;

    if (action === 'approve') {
      await query('UPDATE users SET role = $1, status = $2 WHERE id = $3', ['owner', 'approved', userId]);

      const loginLink = `${process.env.APP_URL}/login`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER||"meronabera2121@gmail.com",
        to: email,
        subject: 'Your Account is Approved',
        html: `<p>Your account has been approved. You can now <a href="${loginLink}">login</a>.</p>`,
      });

      res.status(200).json({ message: 'User approved and notified' });
    } else if (action === 'reject') {
      await query('DELETE FROM users WHERE id = $1', [userId]);

      await transporter.sendMail({
        from: process.env.EMAIL_USER||"meronabera2121@gmail.com",
        to: email,
        subject: 'Your Registration is Rejected',
        html: `<p>We are sorry, but your registration has been rejected.</p>`,
      });

      res.status(200).json({ message: 'User rejected and notified' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error });
  }
}
