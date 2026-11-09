import type { UserRole } from '../../services/users/IUser';

export const ROLE_LABELS: Record<UserRole, string> = {
  Client: 'Cliente',
  Veterinarian: 'Veterinario',
  Admin: 'Administrador',
  SysAdmin: 'Sysadmin',
};

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  roleName: UserRole;
  dni: string;
  registrationNumber: string;
  isSuspended: boolean;
}

export const isProfessionalRole = (role: string) => role === 'Veterinarian' || role === 'Admin';

export interface UserFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  roleName: string;
  dni: string;
  registrationNumber: string;
}
