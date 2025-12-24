const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { signup, login, logoutUser } = require('../controllers/authController');

// Standard Auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logoutUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));
const frontendURL = process.env.CLIENT_URL || 'http://localhost:5173';
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `http://localhost:5173/login?error=failed` }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // Use the variable you defined above or a hardcoded fallback
        const targetURL = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${targetURL}/oauth-success?token=${token}`);
    }
);

module.exports = router;