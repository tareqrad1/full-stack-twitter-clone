import Notification from '../models/notificationSchema.js';
import { ERROR, FAIL, SUCCESS } from '../utils/httpStatus.js';

export const getMyNotification = async(req, res) => {
    try {
        const notification = await Notification.find({ to: req.user._id }).populate({ // get all notification to me (to: req.user.id)
            path: 'from',
            select: 'profileImage username'
        });
        if(!notification) return res.status(404).json({ status: FAIL, error: 'No Notification Found' });
        await Notification.updateOne({ read: true });
        res.status(200).json({ status: SUCCESS, notification });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const deleteNotification = async(req, res) => {
    try {
        await Notification.deleteMany({ to: req.user._id }); //delete to me (to: req.user.id) all notification 
        res.status(200).json({ status: SUCCESS, message: 'Notification deleting successfully' });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};

export const deleteOneNotification = async(req, res) => {
    const {id} = req.params;
    try {
        const notification = await Notification.findById(id);
        if(!notification) return res.status(404).json({ status: FAIL, error: 'Notification Not Found' });
        if(notification.to.toString() !== req.user._id.toString()) return res.status(401).json({ status: FAIL, error: 'You are not allowed to delete this notification' });
        await Notification.findByIdAndDelete(notification);
        res.status(200).json({ status: SUCCESS, message: 'Delete Successfully' });
    } catch (error) {
        return res.status(500).json({ status: ERROR, error: error.message });
    }
};