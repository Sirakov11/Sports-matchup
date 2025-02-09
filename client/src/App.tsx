import { FC, useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import SportSelectionPage from './SportSelectionPage';
import ProfileSetupPage from './ProfileSetupPage';
import UsersList from './UsersList.tsx';

const App: FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'sport' | 'profile' | 'users'>('login');

  return (
    <div>
      {currentPage === 'login' && (
        <LoginPage onLoginSuccess={() => setCurrentPage('sport')} />
      )}
      {currentPage === 'sport' && (
        <SportSelectionPage onContinue={() => setCurrentPage('profile')} />
      )}
      {currentPage === 'profile' && (
        <ProfileSetupPage onProfileComplete={() => setCurrentPage('users')} />
      )}
      {currentPage === 'users' && <UsersList />}
    </div>
  );
};

export default App;
