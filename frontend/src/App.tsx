import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import HomePage from './pages/auth/HomePage';
import Sidebar from './components/common/SideBar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notifications/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
const App = () => {
  return (
		<div className='flex max-w-6xl mx-auto'>
      <Sidebar />
			<Routes>
        <Route path='*' element={<h1>NotFound Page 404</h1>} />
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
			</Routes>
      <RightPanel />
		</div>
	);
}

export default App