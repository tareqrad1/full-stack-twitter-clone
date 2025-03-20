import Notification from '../models/notificationSchema.js';
import { ERROR, FAIL, SUCCESS } from '../utils/httpStatus.js';

export const getMyNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user._id })
            .populate({
                path: 'from',
                select: 'profileImage username'
            });
            
        const filteredNotifications = notifications.filter(n => n.from._id.toString() !== req.user._id.toString());
        if (filteredNotifications.length === 0) {
            return res.status(404).json({ status: "FAIL", error: "No Notification Found" });
        }
        // Mark notifications as read
        await Notification.updateMany({ to: req.user._id }, { read: true });
        res.status(200).json({ status: "SUCCESS", notification: filteredNotifications });
    } catch (error) {
        return res.status(500).json({ status: "ERROR", error: error.message });
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