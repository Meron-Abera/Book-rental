import { query } from '../../../../lib/db'; 
import { verifyToken } from '../../../../utils/jwt'; 

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { authorization } = req.headers;
  const { rentalId, userId, status } = req.body;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  if (!rentalId || !status || status !== 'returned') {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const token = authorization.split(' ')[1];
  let user;

  try {
    user = verifyToken(token); 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    console.log('Returning rental with parameters:', { rentalId, userId, status });

    await query('BEGIN');

    const rentalUpdateResult = await query(
      `
      UPDATE rentals
      SET rent_quantity = rent_quantity + 1, status = $2
      WHERE id = $1
      RETURNING *
      `,
      [rentalId, status]
    );

    if (rentalUpdateResult.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: 'Rental not found or no changes made' });
    }

    await query('COMMIT');

    res.status(200).json(rentalUpdateResult.rows[0]);
  } catch (error) {
    console.error('Error returning rental:', error);
    await query('ROLLBACK');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
