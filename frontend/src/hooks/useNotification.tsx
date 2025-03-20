import { useContext } from "react"
import { NotificationContext } from "../context/NotificationContextProvider";

const useNotification = () => {
    const context = useContext(NotificationContext);
    if(!context) {
        throw new Error('useNotification must be used within a NotificationContextProvider');
    }
    return context;
};

export default useNotification