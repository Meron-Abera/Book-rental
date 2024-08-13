import { query } from '../../../../lib/db';
import { verifyToken } from '../../../../utils/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { authorization } = req.headers;
  const { rentalId } = req.query; 
  const { userId, status } = req.body;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  if (!rentalId) {
    return res.status(400).json({ message: 'Rental ID is required' });
  }

  const token = authorization.split(' ')[1];
  let user;

  try {
    user = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    console.log('Updating rental with parameters:', { userId, status, rentalId });

    await query('BEGIN');

    const rentalUpdateResult = await query(
      `
      UPDATE rentals
      SET renter_id = $1, status = $2
      WHERE id = $3
      RETURNING *
      `,
      [userId, status, rentalId]
    );

    if (rentalUpdateResult.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: 'Rental not found or no changes made' });
    }

    const rentalQuantityUpdateResult = await query(
      `
      UPDATE rentals
      SET rent_quantity = rent_quantity - 1
      WHERE id = $1
      RETURNING *
      `,
      [rentalId]
    );

    if (rentalQuantityUpdateResult.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: 'Rental not found or no changes made' });
    }

    const rentalDetails = await query(
      `
      SELECT owner_id, rent_price
      FROM rentals
      WHERE id = $1
      `,
      [rentalId]
    );

    if (rentalDetails.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: 'Rental details not found' });
    }

    const { owner_id, rent_price } = rentalDetails.rows[0];

    const revenueUpdateResult = await query(
      `
      INSERT INTO revenues (owner_id, revenue_amount)
      VALUES ($1, $2)
      ON CONFLICT (owner_id) DO UPDATE
      SET revenue_amount = revenues.revenue_amount + EXCLUDED.revenue_amount
      RETURNING *
      `,
      [owner_id, rent_price]
    );

    if (revenueUpdateResult.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: 'Owner not found or no changes made' });
    }

    await query('COMMIT');

    res.status(200).json(rentalUpdateResult.rows[0]);
  } catch (error) {
    console.error('Error updating rental:', error);
    await query('ROLLBACK');
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
