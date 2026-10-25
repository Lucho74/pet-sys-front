import type { AssignableRole, UserRole } from '../services/users/IUser';

export const ADMIN_ROLES: UserRole[] = ['SysAdmin', 'Admin'];
export const CLINICAL_ROLES: UserRole[] = [...ADMIN_ROLES, 'Veterinarian'];

export function getManageableRoles(role: UserRole | null): AssignableRole[] {
  if (role !== null && ADMIN_ROLES.includes(role)) return ['Client', 'Veterinarian', 'Admin'];
  if (role === 'Veterinarian') return ['Client'];
  return [];
}