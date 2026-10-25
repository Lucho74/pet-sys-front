import type { IConsultationResponse, ICreateConsultationRequest, IUpdateConsultationRequest } from "./IConsultation";
import { apiFetch } from "../apiClient";

export const handleAddConsultation = async (newConsultation: ICreateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await apiFetch('/Consultation', {
        method: 'POST',
        body: JSON.stringify(newConsultation)
    });

    if (!response.ok) {
        throw new Error('Error creating consultation');
    }

    return response.json();
};

export const handleDeleteConsultation = async (id: string): Promise<string> => {
    const response = await apiFetch(`/Consultation/${id}`, { 
        method: 'DELETE' 
    });

    if (!response.ok) {
        throw new Error('Error deleting consultation');
    }

    return response.text();
};

export const handleUpdateConsultation = async (id: string, updatedConsultation: IUpdateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await apiFetch(`/Consultation/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedConsultation)
    });

    if (!response.ok) {
        throw new Error('Error updating consultation');
    }

    return response.json();
};

export const handleGetByIdConsultation = async (id: string): Promise<IConsultationResponse> => {
    const response = await apiFetch(`/Consultation/${id}`);

    if (!response.ok) {
        throw new Error('Error getting consultation');
    }

    return response.json();
};

export const handleGetAllConsultations = async (): Promise<IConsultationResponse[]> => {
    const response = await apiFetch('/Consultation');

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting consultations');
    }

    return response.json();
};

export const handleGetConsultationsByPet = async (petId: number): Promise<IConsultationResponse[]> => {
    const response = await apiFetch(`/Consultation/pet/${petId}`);

    if (!response.ok) {
        throw new Error('Error getting consultations of the pet');
    }

    return response.json();
};