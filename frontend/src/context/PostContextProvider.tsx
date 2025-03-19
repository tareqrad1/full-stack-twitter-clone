import axios from "axios";
import React, { createContext, useState } from "react";
import toast from "react-hot-toast";



type PostTypes = {
    _id: string;
    text: string;
    image: string
    user: string;
    like: [];
    comment: { user: string; text: string }[];
}

type PostState = {
    isLoading: boolean;
    posts: PostTypes[];
    error: null | string;
    likes: string[];
}
interface PostContextShape {
    data: PostState;
    setData: React.Dispatch<React.SetStateAction<PostState>>;
    getAllPosts: () => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    createPost: (text: string, image: string) => Promise<void>;
    likeUnlikePost: (params: string | undefined) => Promise<void>;
    commentOnPost: (id: string, text: string) => Promise<void>;
}
export const PostContext = createContext<PostContextShape | undefined>(undefined);


const PostContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<PostState>({
        isLoading: false,
        posts: [],
        error: null,
        likes: [],
    });
    const getAllPosts = async () => {
        setData({ ...data, isLoading: true, error: null });
        try {
            const response = await axios.get('/posts/all');
            setData({ ...data, posts: response.data?.posts, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false, posts: [] });
                    toast.error(error.response?.data.error);
                    throw error;
                }
            }
        };
    }
    const deletePost = async (id: string) => {
        setData({ ...data, isLoading: true, error: null });
        try {
            await axios.delete('/posts/delete/' + id);
            setData({ ...data, posts: data.posts.filter((post) => post._id !== id), isLoading: false, error: null });
            toast.success('Post deleted successfully', { id: "deletePost" });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false, posts: [] });
                    toast.error(error.response?.data.error);
                    throw error;
                }
            }
        }
    }
    const createPost = async (text: string, image: string) => {
        setData({ ...data, isLoading: true, error: null });
        try {
            const response = await axios.post('/posts/create', {
                text,
                image,
            });
            setData({ ...data, posts: [response.data?.post, ...data.posts], isLoading: false });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error, { id: "createPost" });
                    throw error;
                }
            }
        }
    }
    const likeUnlikePost = async(params: string | undefined) => {
        try {
            const response = await axios.post(`/posts/like/${params}`);
            setData({ ...data, posts: data.posts.map((post) => post._id === params ? response.data.post : post), isLoading: false });
            toast.success(response.data?.message);
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error, { id: "createPost" });
                    throw error;
                }
            }
        }
    }
    const commentOnPost = async (id: string, text: string) => {
        try {
            const response = await axios.post(`/posts/comment/${id}`, {
                text
            });
            setData({ ...data, isLoading: false, posts: data.posts.map((post) => post?._id === id ? response.data?.post : post)})
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error, { id: "createPost" });
                    throw error;
                }
            }
        }
    }
    return (
        <PostContext.Provider value={{ data, setData, getAllPosts, deletePost, createPost, likeUnlikePost, commentOnPost }}>
            {children}
        </PostContext.Provider>
    )
};

export default PostContextProvider;