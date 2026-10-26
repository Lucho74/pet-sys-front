import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, House, LogOut } from 'lucide-react';
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

function LogoutButton() {
  const { handleUserLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    handleUserLogout();
    navigate('/login', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex shrink-0 items-center gap-2 rounded-[8px] px-3 py-2 text-[14px] font-medium text-[#DDE6ED] transition-colors hover:bg-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED]"
    >
      <LogOut size={17} strokeWidth={2} aria-hidden="true" />
      <span>Cerrar sesión</span>
    </button>
  );
}

export function ScreenShell({
  title,
  icon: Icon,
  backTo,
  homeTo,
  action,
  children,
}: ScreenShellProps) {
  const { role } = useAuth();
  const keepTopRowOnDesktop = Boolean(backTo);

  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden bg-[#DDE6ED] font-sans">
      <header className="flex-none bg-[#27374D] px-5 pb-4 pt-14 lg:px-10 lg:pb-7 lg:pt-8">
        <div
          className={`flex items-center justify-between ${keepTopRowOnDesktop ? '' : 'lg:hidden'}`}
        >
          {backTo ? (
            <Link
              to={backTo}
              className="flex cursor-pointer items-center gap-1 rounded-[8px] text-[15px] font-medium text-[#DDE6ED] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED]"
            >
              <ChevronLeft size={16} strokeWidth={2.5} className="shrink-0 text-[#9DB2BF]" />
              Atrás
            </Link>
          ) : Icon ? (
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[#526D82]">
              <Icon size={13} strokeWidth={2} className="text-[#DDE6ED]" aria-hidden="true" />
            </div>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1">
            {homeTo ? (
              <Link
                to={homeTo}
                aria-label="Volver al panel"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-[#9DB2BF] transition-colors hover:bg-[#526D82] hover:text-[#DDE6ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED] lg:hidden"
              >
                <House size={17} strokeWidth={2} />
              </Link>
            ) : null}

            <div className="lg:hidden">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div
          className={`mt-3.5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6 ${
            keepTopRowOnDesktop ? 'lg:mt-5' : 'lg:mt-0'
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
              {role ? ROLE_LABELS[role] : ''}
            </div>
            <h1 className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED] lg:text-[30px]">
              {title}
            </h1>
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
