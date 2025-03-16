import axios from "axios";
import React, { createContext, SetStateAction, useState } from "react";


type UserTypes = {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    profileImage: string;
}

type DataState = {
    isLoading: boolean;
    users: UserTypes[];
    error: null | string;
}

interface UserContextShape {
    data: DataState;
    setData: React.Dispatch<SetStateAction<DataState>>;
    suggestedUser: () => Promise<void>; 
}

export const UserContext = createContext<UserContextShape | undefined>(undefined);

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [data, setData] = useState<DataState>({
        isLoading: false,
        users: [],
        error: null,
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
    }
    return (
        <UserContext.Provider value={{ data, setData, suggestedUser }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserContextProvider;