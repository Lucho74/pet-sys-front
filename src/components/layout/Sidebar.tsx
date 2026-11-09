import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronsUpDown, LogOut, UserPen } from 'lucide-react';
import { getVisibleNavItems } from './navigation';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from '../users/userTypes';
import { initials } from '../../utils/initials';
import { handleGetCurrentUser } from '../../services/auth/authService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const MENU_BUTTON =
  'h-12 gap-3 px-3 text-[16px] text-sidebar-foreground/75 [&_svg]:size-[22px] group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-[13px]! hover:bg-white/8! hover:text-sidebar-foreground! data-[active=true]:bg-sidebar-accent! data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground! data-[active=true]:shadow-sm';

export function Sidebar() {
  const { token, role, handleUserLogout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();
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
            <img src="/4patas-logo-azul.png" alt="" className="size-11 shrink-0 rounded-lg bg-white object-contain p-0.5" />
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
            <SidebarMenu className="gap-1.5">{home && renderItem(home)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {sections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/50">Gestión</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">{sections.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator className="mx-0 my-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={userName || 'Mi cuenta'}
                  className="h-14 gap-3 px-2 hover:bg-white/8! data-[state=open]:bg-sidebar-accent! group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-1.5!"
                >
                  <Avatar className="size-9 rounded-lg after:rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-foreground text-xs font-semibold text-sidebar">
                      {initials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">{userName}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">{roleLabel}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/60" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'top' : 'right'}
                align="end"
                sideOffset={8}
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
              >
                <DropdownMenuItem disabled>
                  <UserPen />
                  Editar mis datos
                  <span className="ml-auto text-xs">Próximamente</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </SidebarRoot>
  );
}
