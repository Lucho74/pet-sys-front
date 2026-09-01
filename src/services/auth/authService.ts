import { type ILoginRequest, type ILoginResponse } from "./IAuth"

export const handleLogin = async (credentials: ILoginRequest): Promise<ILoginResponse> => {
    const response = await fetch('https://localhost:7140/api/Auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        throw new Error('Error logging in');
    }

    return response.json();
};
