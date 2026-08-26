import { LayoutDashboard, PawPrint, Stethoscope, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Panel',
    description: 'Resumen de la gestión',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/users',
    label: 'Usuarios',
    description: 'Alta, edición y baja de usuarios',
    icon: Users,
  },
  {
    to: '/pets',
    label: 'Mascotas',
    description: 'Alta, edición y baja de mascotas',
    icon: PawPrint,
  },
  {
    to: '/consultations',
    label: 'Consultas',
    description: 'Alta, edición y baja de consultas',
    icon: Stethoscope,
  },
];
