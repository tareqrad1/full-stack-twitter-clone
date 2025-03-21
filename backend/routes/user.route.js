import express from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { getUserProfile, followUnfollow, updateUserProfile, getSuggestedUsers } from "../controllers/user.controller.js";
const router = express.Router();

router.route('/profile/:username')
                        .get(protectedRoute, getUserProfile);
router.route('/update')
                        .post(protectedRoute, updateUserProfile);
router.route('/suggested')
                        .get(protectedRoute, getSuggestedUsers);
router.route('/follow/:id')
                        .post(protectedRoute, followUnfollow);

export default router;