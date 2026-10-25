import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import { isTokenValid, TOKEN_KEY } from '../utils/auth';
import type { UserRole } from '../services/users/IUser';
import { handleGetCurrentUser } from '../services/auth/authService';

interface Props {
  children: ReactNode;
}

const tokenValue = localStorage.getItem(TOKEN_KEY);

const AuthenticationContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(tokenValue);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (!token || !isTokenValid(token)) return;

    let canceled = false;

    handleGetCurrentUser()
      .then((user) => {
        if (!canceled) setRole(user.roleName as UserRole);
      })
      .catch(() => {
        if (!canceled) {
          setRole(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      });

    return () => {
      canceled = true;
    };
  }, [token]);

  const HandleUserLogin = (newToken: string): boolean => {
    if (!isTokenValid(newToken)) return false;

    setRole(null);
    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    return true;
  };

  const HandleUserLogout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem(TOKEN_KEY);
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