import { LayoutDashboard, PawPrint, Stethoscope, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '../../services/users/IUser';
import { CLIENT_ROLES, CLINICAL_ROLES } from '../../utils/roles';

export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  end?: boolean;
  roles?: UserRole[]; // si no se define, lo ve cualquier usuario logueado
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Panel',
    description: 'Resumen de la gestión',
    icon: LayoutDashboard,
    end: true
  },
  {
    to: '/users',
    label: 'Usuarios',
    description: 'Alta, edición y suspensión de usuarios',
    icon: Users,
    roles: CLINICAL_ROLES
  },
  {
    to: '/pets',
    label: 'Mascotas',
    description: 'Alta y edición de mascotas',
    icon: PawPrint,
    roles: CLINICAL_ROLES
  },
  {
    to: '/consultations',
    label: 'Consultas',
    description: 'Alta y edición de consultas',
    icon: Stethoscope,
    roles: CLINICAL_ROLES
  },
  {
  to: '/my-pets',
  label: 'Mis mascotas',
  description: 'Tus mascotas y su historial de consultas',
  icon: PawPrint,
  roles: CLIENT_ROLES
  },
];

export function getVisibleNavItems(role: UserRole | null): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.roles || (role !== null && item.roles.includes(role)));
}
