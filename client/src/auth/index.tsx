import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { authService, LoginCredentials } from './auth-service'

export interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsAuthenticated(await authService.currentAuthStatus())
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const loginSuccess = await authService.login(credentials)

      if (loginSuccess) {
        setIsAuthenticated(true)
      }

      setIsLoading(false)
    } catch (error) {
      console.log('Log in error:', error)
      setIsLoading(false)
      setIsAuthenticated(false)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await authService.logout()
      setIsAuthenticated(false)
      setIsLoading(false)
    } catch (error) {
      console.log('Log out error:', error)
      setIsAuthenticated(false)
      setIsLoading(false)
      throw error
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }

  return isLoading 
    ? <div className='overlay'>Loading...</div>
    : <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
