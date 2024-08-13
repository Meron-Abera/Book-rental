import { query } from '../../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await query(`
      SELECT owner_id, SUM(revenue_amount) as total_revenue
      FROM revenues
      GROUP BY owner_id
      ORDER BY owner_id
    `);

    const data = result.rows.map(row => [row.owner_id, row.total_revenue]);

    res.status(200).json({
      columns: ['Owner ID', 'Revenue'],
      data: data
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
