import { type IPetRequest, type IPetResponse } from "./IPet"
import { apiFetch } from "../apiClient";

export const handleAddPet = async (newPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch('/Pet', {
        method: 'POST',
        body: JSON.stringify(newPet)
    });

    return response.json();
};

export const handleDeletePet = async (id: string): Promise<string> => {
    const response = await apiFetch(`/Pet/${id}`, { 
        method: 'DELETE' 
    });

    return response.text();
};

export const handleUpdatePet = async (id: string, updatedPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPet)
    });

    return response.json();
};

export const handleGetByIdPet = async (id: string): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`);

    return response.json();
};

export const handleGetAllPet = async (): Promise<IPetResponse[]> => {
    const response = await apiFetch('/Pet');

    return response.json();
    
};

export const handleGetMyPets = async (): Promise<IPetResponse[]> => {
    const response = await apiFetch('/Pet/me');

    return response.json();
};
