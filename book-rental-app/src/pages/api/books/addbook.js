import { query } from '../../../../lib/db'; 
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../../../../utils/jwt'; 

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); 
    }
  })
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'File upload error', error: err.message });
      }

      const { title, author, category } = req.body;
      const file = req.file;

      if (!title || !author || !category || !file) {
        return res.status(400).json({ message: 'Please provide all required fields and upload a file.' });
      }

      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      try {
        const decoded = verifyToken(token);
        const ownerId = decoded.id;

        const categoryResult = await query(`
          SELECT id FROM categories WHERE id = $1
        `, [category]);

        if (categoryResult.rows.length === 0) {
          return res.status(400).json({ message: 'Invalid category selected.' });
        }

        const categoryId = categoryResult.rows[0].id;

        const result = await query(`
          INSERT INTO books (title, author, category_id, file_path, owner_id, status)
          VALUES ($1, $2, $3, $4, $5, 'pending')
          RETURNING id
        `, [title, author, categoryId, file.path, ownerId]);

        res.status(200).json({ message: 'Book added successfully', bookId: result.rows[0].id });
      } catch (error) {
        console.error('Error saving book:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    });
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
