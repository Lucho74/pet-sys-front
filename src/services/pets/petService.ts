import { type IPetRequest, type IPetResponse } from "./IPet"

export const handleAddPet = async (newPet: IPetRequest): Promise<IPetResponse> => {
    const response = await fetch('https://localhost:7140/api/Pet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPet)
    });

    if (!response.ok) {
        throw new Error('Error creating pet');
    }

    return response.json();
};

export const handleDeletePet = async (id: string): Promise<string> => {
    const response = await fetch(`https://localhost:7140/api/Pet/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error deleting pet');
    }

    return response.text();
};

export const handleUpdatePet = async (id: string, updatedPet: IPetRequest): Promise<IPetResponse> => {
    const response = await fetch(`https://localhost:7140/api/Pet/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPet)
    });

    if (!response.ok) {
        throw new Error('Error updating pet');
    }

    return response.json();
};

export const handleGetByIdPet = async (id: string): Promise<IPetResponse> => {
    const response = await fetch(`https://localhost:7140/api/Pet/${id}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Error getting pet');
    }

    return response.json();
};

export const handleGetAllPet = async (): Promise<IPetResponse[]> => {
    const response = await fetch('https://localhost:7140/api/Pet', {
        method: 'GET'
    });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting pets');
    }

    return response.json();
};
