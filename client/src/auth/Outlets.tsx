import { useLocation, Navigate, Outlet } from 'react-router'
import NavBar from '../NavBar'
import { useAuth } from '.'

export const PrivateOutlet = () => {
  const location = useLocation()

  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export const PublicOutlet = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname ?? '/'} replace />
  }

  return (
    <>
      <Outlet />
    </>
  )
}
