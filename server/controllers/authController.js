import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already exists' });

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

   
    res.status(201).json({
      msg: 'Signup successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during signup' });
  }
};

export const login = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  try {
   
    const user = await User.findOne({ email: emailOrMobile });
    
    
    if (!user || !user.password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({
      msg: 'Login successful',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error during login' });
  }
};

export const logoutUser = (req, res) => {
  res.status(200).json({ msg: 'Logged out successfully' });
};