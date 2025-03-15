import express from 'express';
import { getMe, signup, login, logout } from '../controllers/auth.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js';

const router = express.Router();

router.route('/me')
                    .get(protectedRoute, getMe)
router.route('/signup')
                    .post(signup)
router.route('/login')
                    .post(login)
router.route('/logout')
                    .post(logout)

export default router;