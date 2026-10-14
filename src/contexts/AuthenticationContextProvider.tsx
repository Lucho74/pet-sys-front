import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthenticationContext } from './AuthenticationContext';
import { isTokenValid } from '../utils/auth';

interface Props {
  children: ReactNode;
}

const tokenValue = localStorage.getItem('pet-sys-token');

const AuthenticationContextProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(tokenValue);

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
        handleUserLogin: HandleUserLogin,
        handleUserLogout: HandleUserLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;