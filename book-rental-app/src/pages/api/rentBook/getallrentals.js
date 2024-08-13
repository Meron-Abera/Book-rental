import { query } from '../../../../lib/db'; 
import { verifyToken } from '../../../../utils/jwt'; 

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      verifyToken(token);

      const result = await query(`
        SELECT rentals.id AS rental_id, books.id AS book_id, books.title, rentals.rent_quantity, rentals.rent_price, rentals.status
        FROM rentals
        INNER JOIN books ON rentals.book_id = books.id
      `);

      return res.status(200).json({ rentals: result.rows });
    } catch (error) {
      console.error('Error retrieving books from rentals:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
