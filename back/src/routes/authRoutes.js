import express from 'express';
import * as authController from '../controllers/authController.js';
const router = express.Router();

// Routes d'authentification
router.post('/register', authController.register);
router.post('/login', authController.login);


export default router;
