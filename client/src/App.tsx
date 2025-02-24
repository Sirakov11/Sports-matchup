import { Routes, Route, Navigate } from 'react-router'
import './App.css'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage.tsx'
import ProfileSetupPage from './ProfileSetupPage'
import MatchupPage from './MatchupPage.tsx'
import MutuallyLikedPage from './MutuallyLikedPage'
import { PublicOutlet, PrivateOutlet } from './auth/Outlets.tsx'
import { AuthProvider } from './auth/index.tsx'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateOutlet />}>
          <Route path='/' element={<Navigate to='matchup' replace />} />
          <Route path='matchup' element={<MatchupPage />} />
          <Route path='profile' element={<ProfileSetupPage />} />
          <Route path='mutuallyliked' element={<MutuallyLikedPage />} />
        </Route>

        <Route element={<PublicOutlet />}>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
