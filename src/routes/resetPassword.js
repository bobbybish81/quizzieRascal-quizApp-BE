import express from 'express';
import resetPassword from '../controllers/resetPasswordController.js';

const router = express.Router();

router.patch('/', resetPassword);

export default router;