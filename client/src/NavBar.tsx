import { NavLink, useNavigate } from 'react-router'
import { useAuth } from './auth'

const NavBar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav>
      <NavLink to="/profile">
        Profile Settings
      </NavLink>
      <NavLink to="/matchup">
        Match Up!
      </NavLink>
      <button onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default NavBar
