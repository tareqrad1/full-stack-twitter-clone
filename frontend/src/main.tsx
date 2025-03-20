import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './context/AuthContextProvider.tsx'
import PostContextProvider from './context/PostContextProvider.tsx'
import UserContextProvider from './context/UserContextProvider.tsx'
import NotificationContextProvider from './context/NotificationContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <PostContextProvider>
        <UserContextProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </UserContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
