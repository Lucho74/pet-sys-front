import { createContext, useContext } from "react";
import type { UserRole } from "../services/users/IUser";

interface AuthenticationContextValue {
    token: string | null;
    role: UserRole | null;
    handleUserLogin: (newToken: string) => boolean;
    handleUserLogout: () => void;
}

export const AuthenticationContext = createContext<AuthenticationContextValue | null>(null);

export const useAuth = () => {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthenticationContextProvider");
    }
    return context;
};