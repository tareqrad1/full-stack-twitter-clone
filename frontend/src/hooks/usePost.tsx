import { useContext } from "react";
import { PostContext } from "../context/PostContextProvider";

const usePost = () => {
    const context = useContext(PostContext);
    if(!context) {
        throw new Error('usePost must be used within a PostContextProvider');
    }
    return context;
};
export default usePost;