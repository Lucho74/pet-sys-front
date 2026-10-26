export interface IPetResponse {
    id: number;
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
    isDeleted: boolean;
}

export interface IPetRequest {
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
}
