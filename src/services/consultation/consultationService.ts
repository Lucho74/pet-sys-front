import type { IConsultationResponse, ICreateConsultationRequest, IUpdateConsultationRequest } from "./IConsultation";

export const handleAddConsultation = async (newConsultation: ICreateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await fetch('https://localhost:7140/api/Consultation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConsultation)
    });

    if (!response.ok) {
        throw new Error('Error creating consultation');
    }

    return response.json();
};

export const handleDeleteConsultation = async (id: string): Promise<string> => {
    const response = await fetch(`https://localhost:7140/api/Consultation/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Error deleting consultation');
    }

    return response.text();
};

export const handleUpdateConsultation = async (id: string, updatedConsultation: IUpdateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await fetch(`https://localhost:7140/api/Consultation/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedConsultation)
    });

    if (!response.ok) {
        throw new Error('Error updating consultation');
    }

    return response.json();
};

export const handleGetByIdConsultation = async (id: string): Promise<IConsultationResponse> => {
    const response = await fetch(`https://localhost:7140/api/Consultation/${id}`, {
        method: 'GET'
    });

    if (!response.ok) {
        throw new Error('Error getting consultation');
    }

    return response.json();
};

export const handleGetAllConsultations = async (): Promise<IConsultationResponse[]> => {
    const response = await fetch('https://localhost:7140/api/Consultation', {
        method: 'GET'
    });

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Error getting consultations');
    }

    return response.json();
};