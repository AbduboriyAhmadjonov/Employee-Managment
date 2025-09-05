import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Mock user model for demonstration
const users: any[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user (admin or staff)
export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, password: hashedPassword, role };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully.' });
};

// Authenticate user, return JWT
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
};

// Middleware to verify JWT
const authenticateJWT = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    (req as any).user = user;
    next();
  });
};

// Get logged-in user details (requires JWT)
export const profile = [
  authenticateJWT,
  (req: Request, res: Response) => {
    const user = (req as any).user;
    res.json({ user });
  },
];

// Invalidate token (optional if JWT is stateless)
export const logout = (req: Request, res: Response) => {
  // For stateless JWT, logout is handled on client side by deleting token
  res.json({ message: 'Logged out successfully.' });
};
