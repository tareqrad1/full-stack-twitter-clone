import axios from "axios";
import React, { createContext, useState } from "react";


type NotificationItemType = {
    _id: string;
    from: {
        _id: string,
        username: string
        profileImage: string;
    },
    type: string;
    to: string;
};

type NotificationType = {
    isLoading: boolean;
    notifications: NotificationItemType[];
    error: null | string;
}

interface NotificationContextShape {
    dataNotification: NotificationType;
    setDataNotification: React.Dispatch<React.SetStateAction<NotificationType>>;
    getAllNotification: () => Promise<void>;
    deleteAllNotification: () => Promise<void>;
    deleteOneNotification: (id: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextShape | undefined>(undefined);

const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [dataNotification, setDataNotification] = useState<NotificationType>({
        isLoading: false,
        notifications: [],
        error: null,
    });
    const getAllNotification = async () => {
        try {
            const response = await axios.get('/notification/');
            setDataNotification({ ...dataNotification, notifications: response.data.notification, isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setDataNotification({ ...dataNotification, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    };
    const deleteAllNotification = async () => {
        try {
            await axios.delete('/notification/');
            setDataNotification({ ...dataNotification, notifications: [], isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setDataNotification({ ...dataNotification, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    };
    const deleteOneNotification = async (id: string) => {
        try {
            await axios.delete('/notification/' + id);
            setDataNotification({ ...dataNotification, notifications: dataNotification.notifications.filter((notification) => notification._id !== id), isLoading: false, error: null });
        } catch (error: unknown) {
            if(axios.isAxiosError(error)) {
                if(error instanceof Error) {
                    setDataNotification({ ...dataNotification, error: error.response?.data.error, isLoading: false });
                    throw error;
                }
            }
        }
    }
    return (
        <NotificationContext.Provider value={{ dataNotification, setDataNotification, getAllNotification, deleteAllNotification, deleteOneNotification }} >
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContextProvider