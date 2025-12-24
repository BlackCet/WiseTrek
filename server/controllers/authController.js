const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Standardized Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already exists' });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create User
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // 4. Send Response
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

exports.login = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  try {
    // Look up by email (since you removed mobile)
    const user = await User.findOne({ email: emailOrMobile });
    
    // Check if user exists and has a password (Google users might not have one)
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

exports.logoutUser = (req, res) => {
  res.status(200).json({ msg: 'Logged out successfully' });
};