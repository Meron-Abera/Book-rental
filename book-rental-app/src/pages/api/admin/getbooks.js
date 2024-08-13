import { query } from '../../../../lib/db';  

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { page = 1, rowsPerPage = 10, title = '', author = '', status = '' } = req.query;

  const pageNumber = parseInt(page, 10);
  const limit = parseInt(rowsPerPage, 10);

  // Validate parameters
  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ message: 'Invalid page number' });
  }
  if (isNaN(limit) || limit < 1) {
    return res.status(400).json({ message: 'Invalid rows per page' });
  }

  const offset = (pageNumber - 1) * limit;

  let queryText = `
    SELECT id, title, author, status
    FROM books
    WHERE TRUE
  `;
  let queryParams = [];

  if (title) {
    queryText += ` AND title ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${title}%`);
  }

  if (author) {
    queryText += ` AND author ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${author}%`);
  }

  if (status) {
    queryText += ` AND status = $${queryParams.length + 1}`;
    queryParams.push(status);
  }

  queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  try {
    const result = await query(queryText, queryParams);

    let totalCountQuery = `
      SELECT COUNT(*) AS total
      FROM books
      WHERE TRUE
    `;
    let totalCountParams = [];

    if (title) {
      totalCountQuery += ` AND title ILIKE $${totalCountParams.length + 1}`;
      totalCountParams.push(`%${title}%`);
    }

    if (author) {
      totalCountQuery += ` AND author ILIKE $${totalCountParams.length + 1}`;
      totalCountParams.push(`%${author}%`);
    }

    if (status) {
      totalCountQuery += ` AND status = $${totalCountParams.length + 1}`;
      totalCountParams.push(status);
    }

    const totalCountResult = await query(totalCountQuery, totalCountParams);
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
