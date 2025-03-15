import Notification from '../models/notificationSchema.js';
import User from '../models/userSchema.js';
import { updateSchema } from '../utils/validation.js';
import { SUCCESS, FAIL, ERROR } from '../utils/httpStatus.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

export const getUserProfile = async(req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select('-password');
        if(!user) {
            return res.status(404).json({ status: FAIL, error: 'User Not Found' })
        }
        res.status(200).json({ status: SUCCESS, user });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};
export const followUnfollow = async(req, res) => {
    const { id } = req.params;
    try {
        const modifyUser = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(!modifyUser || !currentUser) {
            return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        }
        if(id === req.user._id.toString()) {
            return res.status(400).json({ status: FAIL, error: 'You Cant Follow/Unfollow Yourself' })
        }
        const isFollowing = currentUser.following.includes(id);
        if(isFollowing) { //unfollow
            await User.findByIdAndUpdate(id, {
                $pull: {
                    followers: req.user._id, 
                }
            })
            await User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    following: id,
                }
            })
            res.status(200).json({ status: SUCCESS, message: 'Unfollowed Successfully' })
        }else {
			// Follow the user
			await User.findByIdAndUpdate(id, {
                $push: { 
                    followers: req.user._id 
                }
            });
			await User.findByIdAndUpdate(req.user._id, {
                $push: { 
                    following: id 
                } 
            });
			const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: modifyUser._id,
            });
            await newNotification.save();
			res.status(200).json({ status: SUCCESS, message: "Followed Successfully" });
		}
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};
//suggested here
export const updateUserProfile = async(req, res) => {
    let { username, fullname, email, currentPassword, newPassword, bio, link, profileImage, coverImage } = req.body;
    const { error } = updateSchema.validate(req.body);
    if(error) {
        return res.status(400).json({ status: FAIL, error: error.details[0].message });
    }
    try {
        let user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ status: FAIL, error: 'User Not Found' });
        if((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
            return res.status(400).json({ status:FAIL, error: 'Please provide new password and current password' });
        }
        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch) return res.status(404).json({ status:FAIL, error: 'current password Incorrect' });
            user.password = await bcrypt.hash(newPassword, 10);
        }
        if(profileImage) {
            if(user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split('/').pop().split('.')[0]);
            }
            let uploadResponse = await cloudinary.uploader.upload(profileImage);
            profileImage = uploadResponse.secure_url
        }
        if(coverImage) {
            if(user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split('/').pop().split('.')[0]);
            }
            let uploadResponse = await cloudinary.uploader.upload(coverImage);
            coverImage = uploadResponse.secure_url
        }
        user.username = username || user.username;
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.link = link !== undefined ? link : user.link;
        user.bio = bio !== undefined ? bio : user.bio;
        user.coverImage = coverImage !== undefined ? coverImage : user.coverImage;
        user.profileImage = profileImage !== undefined ? profileImage : user.profileImage;
        user = await user.save();
        user.password = null;
        res.status(201).json({ status: SUCCESS, user });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};