import { query } from '../../../../lib/db';  

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await query(`
      SELECT
        COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count
      FROM users
    `);

    const { approved_count, pending_count } = result.rows[0];

    res.status(200).json({
      approved: parseInt(approved_count, 10),
      pending: parseInt(pending_count, 10),
    });
  } catch (error) {
    console.error('Error fetching user status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
