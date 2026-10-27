import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, House, LogOut, PawPrint } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from '../users/userTypes';

interface ScreenShellProps {
  title: string;
  icon?: LucideIcon;
  backTo?: string;
  homeTo?: string;
  action?: ReactNode;
  children: ReactNode;
}

const TOP_LINK_CLASSES =
  'flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[14px] font-bold text-[#526D82] transition-colors hover:bg-[#DDE6ED] hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D]';

function LogoutButton() {
  const { handleUserLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    handleUserLogout();
    navigate('/login', { replace: true });
  };

  return (
    <button type="button" onClick={handleLogout} className={`shrink-0 cursor-pointer ${TOP_LINK_CLASSES}`}>
      <LogOut size={17} strokeWidth={2.2} aria-hidden="true" />
      <span>Cerrar sesión</span>
    </button>
  );
}

export function ScreenShell({
  title,
  icon: Icon = PawPrint,
  backTo,
  homeTo,
  action,
  children,
}: ScreenShellProps) {
  const { role } = useAuth();

  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden bg-[#F4F7F9]">
      <header className="flex-none px-4 pb-2 pt-5 lg:px-10 lg:pb-4 lg:pt-9">
        <div className={`flex items-center justify-between ${backTo ? '' : 'lg:hidden'}`}>
          {backTo ? (
            <Link to={backTo} className={`-ml-2.5 ${TOP_LINK_CLASSES}`}>
              <ChevronLeft size={17} strokeWidth={2.5} aria-hidden="true" />
              Atrás
            </Link>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1 lg:hidden">
            {homeTo ? (
              <Link to={homeTo} aria-label="Volver al panel" className={TOP_LINK_CLASSES}>
                <House size={18} strokeWidth={2.2} />
              </Link>
            ) : null}
            <LogoutButton />
          </div>
        </div>

        <div
          className={`flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${
            backTo ? 'mt-3 lg:mt-4' : 'mt-2 lg:mt-0'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#27374D] lg:h-14 lg:w-14">
              <Icon size={24} strokeWidth={2.2} className="text-[#DDE6ED]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#526D82]">{role ? ROLE_LABELS[role] : ''}</div>
              <h1 className="truncate text-[26px] font-extrabold leading-tight tracking-[-0.3px] text-[#27374D] lg:text-[32px]">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LogoutButton />
            {action}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
