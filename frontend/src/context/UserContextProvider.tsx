import axios from "axios";
import React, { createContext, SetStateAction, useState } from "react";
import toast from "react-hot-toast";


type UserTypes = {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    coverImage: string;
    profileImage: string;
    following: string[];
    followers: string[];
    link: string;
    bio: string;
}

type DataState = {
    isLoading: boolean;
    users: UserTypes[];
    error: null | string;
    profileUser: UserTypes | null;
}

interface UserContextShape {
    data: DataState;
    setData: React.Dispatch<SetStateAction<DataState>>;
    suggestedUser: () => Promise<void>; 
    followUnfollow: (id: string | undefined) => Promise<void>;
    getUserProfile: (params: string | undefined) => Promise<void>;
}

export const UserContext = createContext<UserContextShape | undefined>(undefined);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<DataState>({
        isLoading: false,
        users: [],
        error: null,
        profileUser:  null,
    });

    const suggestedUser = async () => {
        setData({ ...data, isLoading: true, error: null });
        try {
            const response = await axios.get('/users/suggested');
            setData({ ...data, users: response.data, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    };
    const followUnfollow = async (id: string | undefined) => {
        setData({ ...data, isLoading: true, error: null });
        try {
            const response = await axios.post(`/users/follow/${id}`);
            setData({...data, users: data.users.filter((userId) => userId._id !== id), isLoading: false, error: null});
            toast.success(response.data.message);
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    };
    const getUserProfile = async (params: string | undefined) => {
        setData({ ...data, isLoading: true, error: null });
        try {
            const response = await axios.get(`/users/profile/${params}`);
            setData({ ...data, profileUser: response.data?.user, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setData({ ...data, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    };
    return (
        <UserContext.Provider value={{ data, setData, suggestedUser, followUnfollow, getUserProfile }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserContextProvider;