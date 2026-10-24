import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = 'pet-sys-token';

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