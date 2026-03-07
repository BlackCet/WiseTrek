import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Added .js extension

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user to the request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user no longer exists in DB but token is valid
      if (!req.user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

export default protect;