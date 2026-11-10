import type { PageQuery } from '../IPaginated';

export interface ConsultationQuery extends PageQuery {
    mine?: boolean;
}

export interface IConsultationAttachment {
    blobName: string;
    fileName: string | null;
}

export interface IConsultationResponse {
    id: number;
    title: string;
    description: string;
    date: string;
    petId: number;
    veterinarianId: number;
    attachments: IConsultationAttachment[];
    isSuspended: boolean;
}

export interface IConsultationWithParticipantsResponse extends IConsultationResponse {
    petName: string;
    veterinarianName: string;
}

export interface ICreateConsultationRequest {
    title: string;
    description: string | null;
    date: string | null;
    petId: number | null;
    veterinarianId: number | null;
}

export interface IUpdateConsultationRequest {
    title: string;
    description: string | null;
    date: string | null;
    petId: number | null;
    veterinarianId?: number;
}
