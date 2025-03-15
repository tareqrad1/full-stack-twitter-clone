import express from 'express';
import { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPost, getAllLike, getFollowingPost, getUserPost } from '../controllers/post.controller.js';
import protectedRoute from '../middlewares/protectedRoute.js'
const router = express.Router();


router.route('/all')
                .get(protectedRoute, getAllPost)
router.route('/following')
                .get(protectedRoute, getFollowingPost)
router.route('/likes/:id')
                .get(protectedRoute, getAllLike)
router.route('/user/:username')
                .get(protectedRoute, getUserPost)
router.route('/create')
                    .post(protectedRoute, createPost)
router.route('/like/:id')
                    .post(protectedRoute, likeUnlikePost)
router.route('/comment/:id')
                    .post(protectedRoute, commentOnPost)
router.route('/delete/:id')
                    .delete(protectedRoute, deletePost)



export default router;
