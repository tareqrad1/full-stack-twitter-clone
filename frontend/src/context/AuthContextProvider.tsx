import axios, { isAxiosError } from 'axios';
import React, { createContext, ReactNode, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

type AuthUser = {
    _id: string;
    username: string;
    fullname: string;
    password: string;
    confirmPassword: string;
    email: string;
    profileImage: string;
    coverImage: string;
    bio: string;
    link: string;
}
type AuthState = {
    isLoading: boolean;
    data: AuthUser | null;
    error: string | null;
    isCheckingAuth: boolean;
}
interface AuthContextShape {
    state: AuthState;
    setState: React.Dispatch<React.SetStateAction<AuthState>>;
    checkAuth: () => Promise<void>;
    signup: (username: string, fullname: string, email: string, password: string, confirmPassword: string) => Promise<void>;
    signin: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (fullname: string, username: string, email: string, bio: string, currentPassword: string, newPassword: string, link: string) => Promise<void>;
    updateCoverImage: (coverImage: string) => Promise<void>;
    updateProfileImage: (profileImage: string) => Promise<void>;
}
export const AuthContext = createContext<AuthContextShape | undefined>(undefined);

const API_URL = 'http://localhost:3000/api';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AuthState>({
        isLoading: false,
        data: null,
        error: null,
        isCheckingAuth: false,
    });
    // start the functions
    const checkAuth = async () => {
        setState({ ...state, isCheckingAuth: true, error: null });
        try {
            const response = await axios.get('/auth/me');
            setState({ ...state, data: response.data?.user, isCheckingAuth: false, error: null });
        } catch (error: unknown) {
            if(isAxiosError(error)) {
                if(error instanceof Error) {
                    console.log(error);
                    setState({ ...state , isCheckingAuth: false, data: null, error: null });
                    throw error;
                }
            }
        }
    }
    const signup = async (username: string, fullname: string, email: string, password: string, confirmPassword: string) => {
        setState({ ...state, isLoading: true, error: null });
        try {
            await axios.post('/auth/signup', {
                username,
                fullname,
                email,
                password,
                confirmPassword
            });
            setState({ ...state, error: null, isLoading: false });
        } catch (error: unknown) {
            if(isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false })
                    throw error;
                }
            }
        }
    }
    const signin = async (username: string, password: string) => {
        setState({ ...state, isLoading: true, error: null });
        try {
            const response = await axios.post('/auth/login', {
                username,
                password
            });
            setState({ ...state, data: response.data.user, error: null, isLoading: false });
        } catch (error: unknown) {
            if(isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false })
                    throw error;
                }
            }
        }
    }
    const logout = async () => {
        setState({ ...state, data: null, isLoading: false });
        toast.success('Logged out successfully');
        <Navigate to={'/login'} />
        try {
            await axios.post('/auth/logout');
        } catch (error: unknown) {
            if(isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false })
                    throw error;
                }
            }
        }
    }
    const updateProfile = async (fullname: string, username: string, email: string, bio: string, currentPassword: string, newPassword: string, link: string) => {
        setState({ ...state, isLoading: true, error: null });
        try {
            const response = await axios.post('/users/update', {
                fullname,
                email,
                username,
                bio,
                currentPassword,
                newPassword,
                link,
            });
            setState({ ...state, data: response?.data?.user, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error)
                    throw error;
                }
            }
        }
    }
    const updateCoverImage = async (coverImage: string) => {
        setState({ ...state, isLoading: true, error: null });
        try {
            const response = await axios.post('/users/update/', {
                coverImage,
            });
            setState({ ...state, data: response?.data?.user, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error)
                    throw error;
                }
            }
        }
    };
    const updateProfileImage = async (profileImage: string) => {
        setState({ ...state, isLoading: true, error: null });
        try {
            const response = await axios.post('/users/update/', {
                profileImage,
            });
            setState({ ...state, data: response?.data?.user, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setState({ ...state, error: error.response?.data.error, isLoading: false });
                    toast.error(error.response?.data.error)
                    throw error;
                }
            }
        }
    }
    return (
        <AuthContext.Provider value={{ state, setState, checkAuth, signup, signin, logout, updateProfile, updateCoverImage, updateProfileImage  }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider;

