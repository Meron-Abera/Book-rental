import { query } from '../../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, status } = req.body;

  if (!email || !status) {
    return res.status(400).json({ message: 'Email and status are required' });
  }

  try {
    await query(
      'UPDATE users SET status = $1 WHERE email = $2',
      [status, email]
    );

    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
