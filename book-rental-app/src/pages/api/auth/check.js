import { verifyToken } from '../../../../utils/jwt';

export default async function handler(req, res) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const token = authorization.split(' ')[1];
    console.log('Token received:', token); 
    const decoded = verifyToken(token); 
    console.log('Token decoded:', decoded);
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Not authenticated' });
  }
}
