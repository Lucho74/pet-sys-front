import { type ICreateUserRequest, type IUpdateUserRequest, type IUserResponse } from "./IUser"
import { apiFetch } from "../apiClient";

export const handleAddUser = async (newUser: ICreateUserRequest): Promise<IUserResponse> => {
    const response = await apiFetch('/User', {
        method: 'POST',
        body: JSON.stringify(newUser)
    });

    return response.json();
};

export const handleDeleteUser = async (id: string): Promise<string> => {
    const response = await apiFetch(`/User/${id}`, { 
        method: 'DELETE' 
    });

    return response.text();
};

export const handleReactivateUser = async (id: string): Promise<void> => {
    await apiFetch(`/User/${id}/reactivate`, {
        method: 'POST'
    });
};

export const handleUpdateUser =async (id: string, updatedUser: IUpdateUserRequest): Promise<IUserResponse> => {
    const response = await apiFetch(`/User/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser)
    });

    return response.json();
};

export const handleGetByIdUser = async (id: string): Promise<IUserResponse> => {
    const response = await apiFetch(`/User/${id}`);

    return response.json();
};

export const handleGetAllUser = async (): Promise<IUserResponse[]> => {
    const response = await apiFetch('/User');

    return response.json();
};
