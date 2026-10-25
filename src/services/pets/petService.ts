import { type IPetRequest, type IPetResponse } from "./IPet"
import { apiFetch } from "../apiClient";

export const handleAddPet = async (newPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch('/Pet', {
        method: 'POST',
        body: JSON.stringify(newPet)
    });

    if (!response.ok) {
        throw new Error('Error creating pet');
    }

    return response.json();
};

export const handleDeletePet = async (id: string): Promise<string> => {
    const response = await apiFetch(`/Pet/${id}`, { 
        method: 'DELETE' 
    });

    if (!response.ok) {
        throw new Error('Error deleting pet');
    }

    return response.text();
};

export const handleUpdatePet = async (id: string, updatedPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPet)
    });

    if (!response.ok) {
        throw new Error('Error updating pet');
    }

    return response.json();
};

export const handleGetByIdPet = async (id: string): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`);

    if (!response.ok) {
        throw new Error('Error getting pet');
    }

    return response.json();
};

export const handleGetAllPet = async (): Promise<IPetResponse[]> => {
    const response = await apiFetch('/Pet');

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting pets');
    }

    return response.json();
    
};

export const handleGetMyPets = async (): Promise<IPetResponse[]> => {
    const response = await apiFetch('/Pet/me');

    if (!response.ok) {
        throw new Error('Error getting my pets');
    }

    return response.json();
};
