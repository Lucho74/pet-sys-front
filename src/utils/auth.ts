import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { UserRole } from "@/services/users/IUser";

export const TOKEN_KEY = 'pet-sys-token';

const VALID_ROLES: UserRole[] = ['Client', 'Veterinarian', 'Admin', 'SysAdmin'];

interface TokenPayload extends JwtPayload {
    role?: string;
}

export const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token); 
        if(!decodedToken.exp) return false;

        const currentTime = Date.now() / 1000; 

        return currentTime < decodedToken.exp; 
    }catch (error) {
        console.error("Error decoding token:", error);
        return false; 
    }
}

export const getRoleFromToken = (token: string | null): UserRole | null => {
    if (!token || !isTokenValid(token)) return null;

    try{
        const role = jwtDecode<TokenPayload>(token).role;
        return VALID_ROLES.includes(role as UserRole) ? (role as UserRole) : null;
    } catch {
        return null;
    }
}