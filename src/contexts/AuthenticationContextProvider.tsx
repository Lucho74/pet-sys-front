import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import { isTokenValid } from '../utils/auth';
import type { UserRole } from '../services/users/IUser';
import { handleGetCurrentUser } from '../services/auth/authService';

interface Props {
  children: ReactNode;
}

const tokenValue = localStorage.getItem('pet-sys-token');

const AuthenticationContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(tokenValue);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if(!token || !isTokenValid(token)) {
      setRole(null);
      return;
    }

    let canceled = false;

    handleGetCurrentUser()
      .then((user) => {
        if (!canceled) setRole(user.roleName as UserRole);
      })
      .catch(() => {
        if (!canceled) setRole(null);
      });
      
      return () => {
        canceled = true;
      };
  }, [token]);

  const HandleUserLogin = (newToken: string): boolean => {
    if (!isTokenValid(newToken)) return false;

    setToken(newToken);
    localStorage.setItem('pet-sys-token', newToken);
    return true;
  };

  const HandleUserLogout = () => {
    setToken(null);
    localStorage.removeItem('pet-sys-token');
  };

  return (
    <AuthenticationContext.Provider
      value={{
        token,
        role,
        handleUserLogin: HandleUserLogin,
        handleUserLogout: HandleUserLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;