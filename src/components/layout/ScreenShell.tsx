import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, House } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ScreenShellProps {
  eyebrow: string;
  title: string;
  icon?: LucideIcon;
  backTo?: string;
  homeTo?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ScreenShell({
  eyebrow,
  title,
  icon: Icon,
  backTo,
  homeTo,
  action,
  children,
}: ScreenShellProps) {
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

          {homeTo ? (
            <Link
              to={homeTo}
              aria-label="Volver al panel"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-[#9DB2BF] transition-colors hover:bg-[#526D82] hover:text-[#DDE6ED] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED] lg:hidden"
            >
              <House size={17} strokeWidth={2} />
            </Link>
          ) : null}
        </div>

        <div
          className={`mt-3.5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6 ${
            keepTopRowOnDesktop ? 'lg:mt-5' : 'lg:mt-0'
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
              {eyebrow}
            </div>
            <h1 className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED] lg:text-[30px]">
              {title}
            </h1>
          </div>

          {action ? <div className="hidden shrink-0 lg:block">{action}</div> : null}
        </div>
      </header>

      {children}
    </div>
  );
}
