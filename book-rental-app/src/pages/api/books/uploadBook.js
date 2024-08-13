import multer from 'multer';
import path from 'path';
import { query } from '../../../../lib/db'; 
import { verifyToken } from '../../../../utils/jwt'; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads')); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

      const { bookId, bookQuantity, price, status } = req.body;
      const file = req.file;

      if (!bookId || !bookQuantity || !price || !status || !file) {
        return res.status(400).json({ message: 'Please provide all required fields and upload a file.' });
      }

      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      try {
        console.log('Token received:', token);
        const decoded = verifyToken(token);
        console.log('Token decoded:', decoded);

        const ownerId = decoded.id;

        const result = await query(`
          INSERT INTO rentals (book_id, owner_id, renter_id, rent_price, rent_quantity, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id
        `, [parseInt(bookId), ownerId, null, parseFloat(price), parseInt(bookQuantity), status]);

        res.status(200).json({ message: 'Rental details uploaded successfully', rentalId: result.rows[0].id });
      } catch (error) {
        console.error('Error saving rental data:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
      }
    });
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};


export default handler;
