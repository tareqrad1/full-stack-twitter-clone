import express from 'express';
import protectedRoute from '../middlewares/protectedRoute.js';
import { deleteNotification, getMyNotification, deleteOneNotification } from '../controllers/notification.controller.js';
const router = express.Router();

router.route('/')
                .get(protectedRoute, getMyNotification)
                .delete(protectedRoute, deleteNotification)
router.route('/:id')
                .delete(protectedRoute, deleteOneNotification)

export default router;