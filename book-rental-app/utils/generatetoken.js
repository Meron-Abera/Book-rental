
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = 'c97eb99886936a9336607d05e008bf35ab6f7c1356e8a975914d86cab530f323';
if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role }, // Payload
    secret, // Secret key
    { expiresIn: '1h' } // Token expiration
  );
};

const user = {
  id: 1,
  email: 'user@example.com',
  role: 'user'
};

const token = generateToken(user);

console.log('Generated Token:', token);
