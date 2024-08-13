import { query } from '../../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { page = 1, rowsPerPage = 10, location = '' } = req.query;

  const pageNumber = parseInt(page, 10);
  const limit = parseInt(rowsPerPage, 10);
  const locationFilter = location ? `%${location}%` : '%'; 

  // Validate parameters
  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ message: 'Invalid page number' });
  }
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid rows per page' });
  }

  const offset = (pageNumber - 1) * limit;

  try {
    const result = await query(`
      SELECT email, location, phone_number AS "phoneNumber", status
      FROM users
      WHERE location ILIKE $1
      ORDER BY email
      LIMIT $2 OFFSET $3
    `, [locationFilter, limit, offset]);

    const totalCountResult = await query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE location ILIKE $1
    `, [locationFilter]);
    
    const total = parseInt(totalCountResult.rows[0].total, 10);
    
    res.status(200).json({
      users: result.rows,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
