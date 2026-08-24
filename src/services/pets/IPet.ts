export interface IPetResponse {
    id: number;
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
}

export interface IPetRequest {
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
}
