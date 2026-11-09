export interface IConsultationAttachment {
    blobName: string;
    fileName: string | null;
}

export interface IConsultationResponse {
    id: number;
    title?: string | null;
    description: string | null;
    date: string | null;
    petId: number | null;
    veterinarianId: number | null;
    attachments: IConsultationAttachment[];
    isSuspended: boolean;
}

export interface IConsultationWithParticipantsResponse extends IConsultationResponse {
    petName: string | null;
    veterinarianName: string | null;
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
}
