// import { atom } from 'jotai'

// export const isAuthenticatedAtom = atom(
//   async () => {
//     const response = await fetch('http://localhost:3000/login', {
//       credentials: 'include',
//     })

//     return response.ok
//   },
//   (_get, _set, update: boolean | null) => update
// )

export interface LoginCredentials {
  name: string;
  password: string;
}

class AuthService {
  async currentAuthStatus() {
    const response = await fetch('http://localhost:3000/login', {
      credentials: 'include',
    })

    return response.ok;
  }

  async login(loginCredentials: LoginCredentials): Promise<boolean> {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginCredentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.ok;
  }

  async logout() {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
  }
}

export const authService = new AuthService();
