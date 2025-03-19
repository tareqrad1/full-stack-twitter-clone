import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import usePost from "../../hooks/usePost";

interface User {
	_id: string;
	username: string;
	fullName: string;
	profileImage?: string;
}

interface Comment {
	_id: string;
	text: string;
	user: User;
}

interface PostTypes {
	_id: string;
	text: string;
	image?: string;
	user: User;
	like: string[];
	comment: Comment[];
}

const Post: React.FC<{ post: PostTypes }> = ({ post }) => {
	const [comment, setComment] = useState<string>("");
	const { state } = useAuth(); // Assumes `state.data` contains user info
	const { deletePost, likeUnlikePost, commentOnPost } = usePost();

	// Check if the user has liked the post
	const isLiked = post.like.includes(state?.data?._id ?? "");
	const isMyPost = post.user._id === state?.data?._id;
	const formattedDate = "1h"; // Replace with a dynamic date/time formatting logic

	const handlePostComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (comment.trim() !== "") {
		await commentOnPost(post._id, comment); // Assuming commentOnPost is defined in `usePost`
		setComment('');
		}
	};

	const handleLikePost = async () => {
		await likeUnlikePost(post._id); // Assuming likeUnlikePost is defined in `usePost`
	};

	return (
		<div className="flex gap-2 items-start p-4 border-b border-gray-700">
		<div className="avatar">
			<Link to={`/profile/${post.user.username}`} className="w-8 rounded-full overflow-hidden">
			<img src={post.user.profileImage || "/avatar-placeholder.png"} alt="Profile" />
			</Link>
		</div>
		<div className="flex flex-col flex-1">
			<div className="flex gap-2 items-center">
			<Link to={`/profile/${post.user.username}`} className="font-bold">
				{post.user.fullName}
			</Link>
			<span className="text-gray-700 flex gap-1 text-sm">
				<Link to={`/profile/${post.user.username}`}>@{post.user.username}</Link>
				<span>·</span>
				<span>{formattedDate}</span>
			</span>
			{isMyPost && (
				<span className="flex justify-end flex-1" onClick={() => deletePost(post._id)}>
				<FaTrash className="cursor-pointer hover:text-red-500" />
				</span>
			)}
			</div>
			<div className="flex flex-col gap-3 overflow-hidden">
			<span>{post.text}</span>
			{post.image && (
				<img
				src={post.image}
				className="h-80 object-contain rounded-lg border border-gray-700"
				alt="Post Image"
				/>
			)}
			</div>
			<div className="flex justify-between mt-3">
			<div className="flex gap-4 items-center w-2/3 justify-between">
				<div
				className="flex gap-1 items-center cursor-pointer group"
				onClick={() => {
					const modal = document.getElementById("comments_modal" + post._id);
					if (modal) (modal as HTMLDialogElement).showModal();
				}}
				>
				<FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
				<span className="text-sm text-slate-500 group-hover:text-sky-400">{post.comment.length}</span>
				</div>
				<dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
				<div className="modal-box rounded border border-gray-600">
					<h3 className="font-bold text-lg mb-4">COMMENTS</h3>
					<div className="flex flex-col gap-3 max-h-60 overflow-auto">
					{post.comment.length === 0 && <p className="text-sm text-slate-500">No comments yet 🤔</p>}
					{post.comment.map((comment) => (
						<div key={comment._id} className="flex gap-2 items-start">
						<div className="avatar">
							<div className="w-8 rounded-full">
							<img src={comment.user.profileImage || "/avatar-placeholder.png"} alt="Commenter" />
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex items-center gap-1">
							<span className="font-bold">{comment.user.fullName}</span>
							<span className="text-gray-700 text-sm">@{comment.user.username}</span>
							</div>
							<div className="text-sm">{comment.text}</div>
						</div>
						</div>
					))}
					</div>
					<form
					className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
					onSubmit={handlePostComment}
					>
					<textarea
						className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
						placeholder="Add a comment..."
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button className="btn btn-primary rounded-full btn-sm text-white px-4">
						Post
					</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button className="outline-none">close</button>
				</form>
				</dialog>
				<div className="flex gap-1 items-center group cursor-pointer">
				<BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
				<span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
				</div>
				<div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
				{isLiked ? (
					<FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500" />
				) : (
					<FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
				)}
				<span className={`text-sm text-slate-500 group-hover:text-pink-500 ${isLiked ? "text-pink-500" : ""}`}>
					{post.like.length}
				</span>
				</div>
			</div>
			<div className="flex w-1/3 justify-end gap-2 items-center">
				<FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
			</div>
			</div>
		</div>
		</div>
	);
};

export default Post;
