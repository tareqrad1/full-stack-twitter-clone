import React, { useEffect } from 'react'
import Sidebar from './components/common/SideBar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/auth/HomePage'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import NotificationPage from './pages/notifications/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import RightPanel from './components/common/RightPanel'
import useAuth from './hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import LoadingSpinner from './components/common/LoadingSpinner'

const App: React.FC = (): React.JSX.Element => {
	const { checkAuth, state } = useAuth();
	useEffect(() => {
		checkAuth();
	},[]);

	if(state.isCheckingAuth) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		)
	};
	console.log(state.data, 'data');
	
  return (
	<div className='flex max-w-6xl mx-auto'>
		{state.data && <Sidebar />}
			<Routes>
				<Route path='*' element={<h1>NotFound Page 404</h1>} />
				<Route path='/' element={state.data ?  <HomePage /> : <Navigate to='/login' />} />
				<Route path='/signup' element={!state?.data ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/login' element={!state?.data ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={state?.data ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={state?.data ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
		{state.data && <RightPanel />}
		<Toaster />
	</div>
  )
}

export default App