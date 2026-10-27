import { apiFetch } from "../apiClient";
import type { IUserResponse } from "../users/IUser";
import type { ILoginRequest } from "./IAuth";


export const HandleLogin = async (loginRequest: ILoginRequest) => {
    const response = await apiFetch('/Authentication/authenticate', {
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });

    const token = (await response.text()).trim();

    if (!token) {
        throw new Error('La API devolvió un token vacío.');
    }

    return { token };
}

export const handleGetCurrentUser = async (): Promise<IUserResponse> => {
    const response = await apiFetch('/User/me');
    return response.json();
}