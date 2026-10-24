import { type ICreateUserRequest, type IUpdateUserRequest, type IUserResponse } from "./IUser"
import { apiFetch } from "../apiClient";

export const handleAddUser = async (newUser: ICreateUserRequest): Promise<IUserResponse> => {
    const response = await apiFetch('/User', {
        method: 'POST',
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        throw new Error('Error creating user');
    }

    return response.json();
};

export const handleDeleteUser = async (id: string): Promise<string> => {
    const response = await apiFetch(`/User/${id}`, { 
        method: 'DELETE' 
    });

    if (!response.ok) {
        throw new Error('Error deleting user');
    }

    return response.text();
};

export const handleUpdateUser = async (id: string, updatedUser: IUpdateUserRequest): Promise<IUserResponse> => {
    const response = await apiFetch(`/User/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
        throw new Error('Error updating user');
    }

    return response.json();
};

export const handleGetByIdUser = async (id: string): Promise<IUserResponse> => {
    const response = await apiFetch(`/User/${id}`);

    if (!response.ok) {
        throw new Error('Error getting user');
    }

    return response.json();
};

export const handleGetAllUser = async (): Promise<IUserResponse[]> => {
    const response = await apiFetch('/User');

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting users');
    }

    return response.json();
};
