import { query } from '../../../../lib/db';  

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const result = await query(`
      UPDATE users
      SET status = 'banned'
      WHERE email = $1
      RETURNING *
    `, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User disabled successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
