import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Dummy user store for demonstration
const users: any[] = [];

// Secret for JWT (in production, use env variable)
const JWT_SECRET = 'your_jwt_secret';

// Middleware to authenticate JWT
function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header missing' });
  }
}

const router = Router();

// Register route
router.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const user = { id: users.length + 1, username, password, role };
  users.push(user);
  res.status(201).json({ message: 'User registered', user: { id: user.id, username, role } });
});

// Login route
router.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });
  res.json({ token });
});

// Profile route (protected)
router.get('/api/auth/profile', authenticateJWT, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ user });
});

// Logout route (optional for stateless JWT)
router.post('/api/auth/logout', (req: Request, res: Response) => {
  // For stateless JWT, logout is handled on client side by deleting token
  res.json({ message: 'Logged out (client should delete token)' });
});

export default router;
