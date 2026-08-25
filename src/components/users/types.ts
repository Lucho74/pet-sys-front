import type { UserRole } from '../../services/users/IUser';

export const ROLE_LABELS: Record<UserRole, string> = {
  Client: 'Cliente',
  Veterinarian: 'Veterinario',
  Admin: 'Administrador',
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roleName: UserRole;
  dni: string;
}

export interface UserFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleName: string;
  dni: string;
}

export interface UsersOutletContext {
  users: User[];
  removeUser: (userId: number) => void;
}
