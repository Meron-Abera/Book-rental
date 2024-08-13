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

  try {
    const totalCountResult = await query(`
      SELECT COUNT(*) AS total
      FROM books
    `);
    
    const totalBooks = parseInt(totalCountResult.rows[0].total, 10);

    const result = await query(`
      SELECT c.name AS category, COUNT(b.id) AS count
      FROM books b
      JOIN categories c ON b.category_id = c.id
      GROUP BY c.name
    `);

    const categoriesWithPercentages = result.rows.map(row => {
      const percentage = (row.count / totalBooks * 100).toFixed(2);
      return {
        category: row.category,
        count: row.count,
        percentage: `${percentage}%`
      };
    });

    res.status(200).json(categoriesWithPercentages);
  } catch (error) {
    console.error('Error fetching book statistics:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
