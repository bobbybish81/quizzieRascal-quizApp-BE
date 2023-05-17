import express from 'express';
import updateLeaderboard from '../controllers/leaderboardController.js';
import authenticateToken from '../utils/authenticateToken.js';

const router = express.Router();

router.post('/:userid', authenticateToken, updateLeaderboard);

export default router;