import express from 'express';
import leaderboardAPI from '../../controllers/apiController.js';
import authenticateToken from '../../utils/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, leaderboardAPI);

export default router;