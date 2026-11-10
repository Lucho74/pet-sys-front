import type { AssignableRole, UserRole } from '../services/users/IUser';

export const ADMIN_ROLES: UserRole[] = ['SysAdmin', 'Admin'];
export const CLINICAL_ROLES: UserRole[] = [...ADMIN_ROLES, 'Veterinarian'];
export const CLIENT_ROLES: UserRole[] = ['Client'];

export const PROFILE_VIEW_ROLES: UserRole[] = ['Client', 'Veterinarian', 'Admin', 'SysAdmin'];
export const PROFILE_EDIT_ROLES: UserRole[] = ['Veterinarian', 'Admin', 'SysAdmin'];

export const canViewOwnProfile = (role: UserRole | null) =>
  role !== null && PROFILE_VIEW_ROLES.includes(role);

export const canEditOwnProfile = (role: UserRole | null) =>
  role !== null && PROFILE_EDIT_ROLES.includes(role);

export function getManageableRoles(role: UserRole | null): AssignableRole[] {
  if (role === 'SysAdmin') return ['Client', 'Veterinarian', 'Admin'];
  if (role === 'Admin') return ['Client', 'Veterinarian'];
  if (role === 'Veterinarian') return ['Client'];
  return [];
}

export const canManage = (role: UserRole | null, targetRole: UserRole) =>
  (getManageableRoles(role) as UserRole[]).includes(targetRole);
