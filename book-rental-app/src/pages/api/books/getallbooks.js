import { query } from '../../../../lib/db'; 

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT id, title FROM books ORDER BY title ASC');
      res.status(200).json({ books: result.rows });
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
