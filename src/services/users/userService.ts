import { type ICreateUserRequest, type IUpdateUserRequest, type IUserResponse } from "./IUser"

export const handleAddUser = async (newUser: ICreateUserRequest): Promise<IUserResponse> => {
    const response = await fetch('https://localhost:7140/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    if (!response.ok) {
        throw new Error('Error creating user');
    }

    return response.json();
};

export const handleDeleteUser = async (id: string): Promise<string> => {
    const response = await fetch(`https://localhost:7140/api/User/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error deleting user');
    }

    return response.text();
};

export const handleUpdateUser = async (id: string, updatedUser: IUpdateUserRequest): Promise<IUserResponse> => {
    const response = await fetch(`https://localhost:7140/api/User/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
        throw new Error('Error updating user');
    }

    return response.json();
};

export const handleGetByIdUser = async (id: string): Promise<IUserResponse> => {
    const response = await fetch(`https://localhost:7140/api/User/${id}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Error getting user');
    }

    return response.json();
};

export const handleGetAllUser = async (): Promise<IUserResponse[]> => {
    const response = await fetch('https://localhost:7140/api/User', {
        method: 'GET'
    });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting users');
    }

    return response.json();
};
