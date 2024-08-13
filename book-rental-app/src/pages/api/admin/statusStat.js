import { query } from '../../../../lib/db';  

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await query(`
      SELECT status, COUNT(*) AS count
      FROM books
      WHERE status IN ('approved', 'rejected')
      GROUP BY status
    `);

    const statusCounts = result.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count, 10);
      return acc;
    }, {});

    res.status(200).json(statusCounts);
  } catch (error) {
    console.error('Error fetching book status counts:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
