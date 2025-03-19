import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";
import usePost from "../../hooks/usePost";

const Posts = () => {
	const { data, getAllPosts } = usePost();
	const isLoading = data.isLoading;
	useEffect(() => {
		getAllPosts();
	}, []);
	const POSTS = data.posts
	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post, idx) => (
						<Post key={idx} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;