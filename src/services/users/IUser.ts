export interface IUserResponse {
    id: number;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    isDeleted: boolean;
}

export interface IUserRequest {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
}
