import { type UserQuery, type ICreateUserRequest, type IUpdateUserRequest, type IUserResponse } from "./IUser"
import { apiFetch } from "../apiClient";
import { fetchAllPages, toQueryString, type IPaginatedResponse } from "../IPaginated";

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

export const handleGetUsersPage = async (query: UserQuery): Promise<IPaginatedResponse<IUserResponse>> => {
    const response = await apiFetch(`/User?${toQueryString(query)}`);

    return response.json();
};

export const handleGetAllUser = (): Promise<IUserResponse[]> => fetchAllPages(handleGetUsersPage);
