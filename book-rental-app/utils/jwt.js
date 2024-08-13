import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const signToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
};


export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
