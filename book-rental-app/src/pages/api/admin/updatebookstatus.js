import { query } from '../../../../lib/db';  

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id, status } = req.body;

  if (!id || !status || !['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    await query(`
      UPDATE books
      SET status = $1
      WHERE id = $2
    `, [status, id]);

    res.status(200).json({ message: 'Book status updated successfully' });
  } catch (error) {
    console.error('Error updating book status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
