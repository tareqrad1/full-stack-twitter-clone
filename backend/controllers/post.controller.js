import Post  from '../models/postSchema.js'
import User from '../models/userSchema.js';
import Notification from '../models/notificationSchema.js';
import { ERROR, FAIL, SUCCESS } from '../utils/httpStatus.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = async(req, res) => {
    let { text, image } = req.body;
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        if(!text && !image) {
            return res.status(400).json({ status: FAIL, error: 'Post must have text or image' });
        }
        if(image) {
            let uploadResponse = await cloudinary.uploader.upload(image);
            image = uploadResponse.secure_url;
        }
        const newPost = new Post({
            user: user,
            text,
            image,
        });
        await newPost.save();
        res.status(201).json({ status: SUCCESS, post: newPost });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const deletePost = async(req, res) => {
    const {id} = req.params;
    try {
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({ status: FAIL, error: 'Post Not Found' });
        //owner post
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ status: FAIL, error: 'you are not authorized to delete this post' });
        }
        await Post.findByIdAndDelete(post.id);
        if(post.image) {
            await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0]);
        }
        res.status(200).json({ status: SUCCESS, message: 'Deleting post successfully' });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const commentOnPost = async(req, res) => {
    const { text } = req.body;
    const {id} = req.params;
    try {
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({ status: FAIL, error: 'Post Not Found' });
        const comment = { user: req.user._id, text };
        post.comment.push(comment);
        await post.save();
        res.status(201).json({ status: SUCCESS, message: 'comment added successfully', post });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const likeUnlikePost = async(req, res) => {
    const {id} = req.params;
    try {
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({ status: FAIL, error: 'Post Not Found' });

        const userLikedPost = post.like.includes(req.user._id);
        if(userLikedPost) {
            await Post.findByIdAndUpdate(id, {
                $pull: {
                    like: req.user._id,
                }
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    likedPost: id,
                }
            })
            const updatedPost = await Post.findById(id);
            res.status(200).json({ status: "SUCCESS", message: 'Post Unliked Successfully', post: updatedPost });
        }else {
            post.like.push(req.user._id);
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    likedPost: id,
                }
            })
            await post.save();
            const notification = new Notification({
                type: "like",
                from: req.user._id,
                to: post.user,
            })
            await notification.save();
            const updatedPost = await Post.findById(id);

            res.status(200).json({ status: SUCCESS, message: 'Post Liked Successfully', post: updatedPost });
        }
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const getAllPost = async(req, res) => {
    try {
        const posts = await Post.find({}, {'__v': 0}).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: 'comment.user',
            select: '-password',
        });
        res.status(200).json({ status: SUCCESS, posts });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const getAllLike = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        
        const likedPosts = await Post.find({_id: {$in: user.likedPost}}).populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: 'comment.user',
            select: '-password',
        });
        res.status(200).json({ status: SUCCESS, liked: likedPosts })
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const getFollowingPost = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        
        const feedPosts = await Post.find({ user: {$in: user.following} }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json({ status: SUCCESS, posts: feedPosts });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const getUserPost = async(req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comment.user',
            select: '-password',
        });
        res.status(200).json({ status: SUCCESS, posts });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};