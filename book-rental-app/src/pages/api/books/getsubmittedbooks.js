import { query } from '../../../../lib/db';  
import { verifyToken } from '../../../../utils/jwt';  

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authorization.split(' ')[1];
  let user;

  try {
    user = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const { page = 1, rowsPerPage = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limit = parseInt(rowsPerPage, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ message: 'Invalid page number' });
  }
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid rows per page' });
  }

  const offset = (pageNumber - 1) * limit;

  try {
    const result = await query(`
      SELECT b.id, b.title, b.author, c.name AS category_name, b.status
      FROM books b
      JOIN categories c ON b.category_id = c.id
      WHERE b.owner_id = $1
      ORDER BY b.title
      LIMIT $2 OFFSET $3
    `, [user.id, limit, offset]);

    const totalCountResult = await query(`
      SELECT COUNT(*) AS total
      FROM books b
      WHERE b.owner_id = $1
    `, [user.id]);
    
    const total = parseInt(totalCountResult.rows[0].total, 10);
    
    res.status(200).json({
      books: result.rows,
      total
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
