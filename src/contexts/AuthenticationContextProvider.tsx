import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import { getRoleFromToken, isTokenValid, TOKEN_KEY } from '../utils/auth';

interface Props {
  children: ReactNode;
}

const tokenValue = localStorage.getItem(TOKEN_KEY);

const AuthenticationContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(tokenValue);

  const role = getRoleFromToken(token);

  const HandleUserLogin = (newToken: string): boolean => {
    if (!isTokenValid(newToken)) return false;

    setToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    return true;
  };

  const HandleUserLogout = () => {
    setToken(null);
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