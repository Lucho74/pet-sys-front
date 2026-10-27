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
  isDeleted: boolean;
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
  setUserDeleted: (userId: number, isDeleted: boolean) => void;
}

// Orden y títulos de las secciones del listado de usuarios.
export const ROLE_SECTIONS: { role: UserRole; title: string }[] = [
  { role: 'SysAdmin', title: 'Sysadmins' },
  { role: 'Admin', title: 'Administradores' },
  { role: 'Veterinarian', title: 'Veterinarios' },
  { role: 'Client', title: 'Clientes' },
];
