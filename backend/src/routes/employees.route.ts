import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import authenticateJWT from '../middleware/auth.middleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'some shitty secret';

// Register route
router.post('/employees', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, profileImage } = req.body;
    if (!name || !email || !password || !role || !profileImage) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, profileImage });
    await newUser.save();
    res.status(201).json({ message: 'User registered', user: { email, name, role, profileImage } });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Profile route (protected)
router.get('/auth/profile', authenticateJWT, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user });
});

// Logout route (optional for stateless JWT)
router.post('/auth/logout', (req: Request, res: Response) => {
  // For stateless JWT, logout is handled on client side by deleting token
  res.json({ message: 'Logged out (client should delete token)' });
});

export default router;
