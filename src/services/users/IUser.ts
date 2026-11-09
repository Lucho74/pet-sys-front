import type { PageQuery } from "../IPaginated";

export type UserRole = 'Client' | 'Veterinarian' | 'Admin' | 'SysAdmin';
export type AssignableRole = Exclude<UserRole, 'SysAdmin'>;

export interface IUserResponse {
    id: number;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    isSuspended: boolean;
    roleName: string | null;
    dni: string | null;
    registrationNumber: string | null;
}

export interface ICreateUserRequest {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    role: AssignableRole;
    dni: string | null;
    registrationNumber: string | null;
}

export interface IUpdateUserRequest {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    dni: string | null;
    registrationNumber: string | null;
}

export interface UserQuery extends PageQuery {
    role?: string;
    isSuspend?: boolean;
}
