import express from 'express';
import logout from '../controllers/logoutController.js';
import authenticateToken from '../utils/authenticateToken.js';

const router = express.Router();

router.delete('/:userid', authenticateToken, logout);

export default router;