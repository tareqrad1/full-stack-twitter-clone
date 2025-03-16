import { useContext } from 'react'
import { AuthContext } from '../context/AuthContextProvider'

const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) { 
        throw new Error('useAuth must be used within a AuthContextProvider');
    }
    return context
};

export default useAuth