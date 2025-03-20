import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useEffect } from "react";
import useNotification from "../../hooks/useNotification";
import toast, { LoaderIcon } from "react-hot-toast";

const NotificationPage = () => {
	const { getAllNotification, dataNotification, deleteAllNotification, deleteOneNotification } = useNotification();
	const isLoading = dataNotification?.isLoading;
	useEffect(() => {
		getAllNotification()
	},[]);
	
	const deleteNotifications = () => {
		deleteAllNotification();
		toast.success('All notifications deleted successfully');
	};
	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{dataNotification.notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{dataNotification.notifications?.map((notification) => (
					<div className='border-b border-gray-700 flex justify-between items-center' key={notification._id}>
						<div className='flex gap-2 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImage || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
						<button className="btn btn-ghost" onClick={() => {
							deleteOneNotification(notification._id);
						}}>{isLoading ? <LoaderIcon className="animate-spin size-2" /> : 'X'}</button>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;