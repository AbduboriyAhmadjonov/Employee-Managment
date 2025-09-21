import { Router } from 'express';
import authenticateJWT from '../middleware/auth.middleware.js';
import { register, login, getProfile } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateJWT, getProfile);

export default router;
