export type UserRole = 'Client' | 'Veterinarian' | 'Admin' | 'SysAdmin';
export type AssignableRole = Exclude<UserRole, 'SysAdmin'>;

export interface IUserResponse {
    id: number;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    isDeleted: boolean;
    roleName: string | null;
    dni: string | null;
}

export interface ICreateUserRequest {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    userType: AssignableRole;
    dni: string | null;
}

export interface IUpdateUserRequest {
    fullName: string | null;
    email: string | null;
    phone: string | null;
    password: string | null;
    roleName: AssignableRole;
    dni: string | null;
}
