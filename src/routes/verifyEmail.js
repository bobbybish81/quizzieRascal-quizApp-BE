import express from 'express';
import verifyEmail from '../controllers/verifyEmailController.js';

const router = express.Router();

router.post('/', verifyEmail);

export default router;