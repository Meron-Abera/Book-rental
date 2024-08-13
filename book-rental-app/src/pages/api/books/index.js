import { protect } from '../../../../middleware/auth';
import { defineAbilitiesFor } from '../../../../utils/casl';
import { query } from '../../../../lib/db';

const handler = async (req, res) => {
  const user = req.user;
  const ability = defineAbilitiesFor(user);

  if (req.method === 'GET') {
    const books = await query('SELECT * FROM books');
    res.status(200).json(books.rows);
  } else if (req.method === 'POST') {
    if (ability.can('create', 'Book')) {
      const { title, author, category } = req.body;
      await query('INSERT INTO books (title, author, category, userId) VALUES ($1, $2, $3, $4)', [title, author, category, user.id]);
      res.status(201).json({ message: 'Book created' });
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default protect(handler);
