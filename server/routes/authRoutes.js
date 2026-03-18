import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { signup, login, logoutUser } from '../controllers/authController.js'; // Added .js extension

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logoutUser);


router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `http://localhost:5173/login?error=failed` }),
    (req, res) => {
        
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        
        const targetURL = process.env.CLIENT_URL || 'http://localhost:5173';
        res.redirect(`${targetURL}/oauth-success?token=${token}`);
    }
);

export default router;