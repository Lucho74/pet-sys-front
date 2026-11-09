import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, PawPrint } from 'lucide-react';
import { getVisibleNavItems } from './navigation';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from '../users/userTypes';
import { initials } from '../../utils/initials';
import { handleGetCurrentUser } from '../../services/auth/authService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const MENU_BUTTON =
  'h-10 gap-3 text-[15px] text-sidebar-foreground/75 [&_svg]:size-5 group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-2.5! hover:bg-white/8! hover:text-sidebar-foreground! data-[active=true]:bg-sidebar-accent! data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground! data-[active=true]:shadow-sm';

export function Sidebar() {
  const { token, role, handleUserLogout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!token) return;
    handleGetCurrentUser()
      .then((user) => setUserName(user.fullName ?? ''))
      .catch(() => {});
  }, [token]);

  const [home, ...sections] = getVisibleNavItems(role);
  const roleLabel = role ? ROLE_LABELS[role] : '';

  const isActive = (to: string, end?: boolean) => (end ? pathname === to : pathname.startsWith(to));

  const handleLogout = () => {
    handleUserLogout();
    navigate('/login', { replace: true });
  };

  const renderItem = ({ to, label, icon: Icon, end }: typeof home) => (
    <SidebarMenuItem key={to}>
      <SidebarMenuButton asChild isActive={isActive(to, end)} tooltip={label} className={MENU_BUTTON}>
        <Link to={to} onClick={() => setOpenMobile(false)}>
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            to="/"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md p-1 group-data-[collapsible=icon]:hidden"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <PawPrint className="size-5" />
            </div>
            <div className="grid min-w-0 leading-tight">
              <span className="truncate font-semibold">4 Patas</span>
              <span className="truncate text-xs text-sidebar-foreground/60">Clínica veterinaria</span>
            </div>
          </Link>
          <SidebarTrigger className="size-10 shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground [&_svg]:size-5" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{home && renderItem(home)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50">Gestión</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{sections.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 p-1 group-data-[collapsible=icon]:p-0">
              <Avatar className="size-9 rounded-lg after:rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-foreground text-xs font-semibold text-sidebar">
                  {initials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">{userName}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">{roleLabel}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión" className={`${MENU_BUTTON} text-sidebar-foreground/80`}>
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}
