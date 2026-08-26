export type StatusConsultation = 'Pending' | 'Completed' | 'Cancelled';

export interface IConsultationResponse {
    id: number;
    description: string | null;
    date: string | null;
    status: StatusConsultation;
    petId: number | null;
    veterinarianId: number | null;
}

export interface ICreateConsultationRequest {
    description: string | null;
    date: string | null;
    petId: number | null;
    veterinarianId: number | null;
}

export interface IUpdateConsultationRequest {
    description: string | null;
    date: string | null;
    status: StatusConsultation;
    petId: number | null;
    veterinarianId: number | null;
}