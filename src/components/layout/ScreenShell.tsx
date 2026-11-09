import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

const HEADER_ICON_CLASSES = 'size-9 shrink-0 rounded-lg lg:size-11';

function handleBackClick(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const index: unknown = window.history.state?.idx;
  if (typeof index !== 'number' || index <= 0) return;

  event.preventDefault();
  window.history.back();
}

interface ScreenShellProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backTo?: string;
  homeTo?: string;
  action?: ReactNode;
  reserveActionSpace?: boolean;
  children: ReactNode;
}

export function ScreenShell({ title, description, icon: Icon, backTo, action, reserveActionSpace, children }: ScreenShellProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden bg-[#DDE6ED] font-sans">
      <div className="flex flex-none flex-col gap-4 px-4 pt-5 sm:flex-row sm:items-end sm:justify-between lg:px-10 lg:pt-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 size-9 lg:hidden [&_svg]:size-5" />
          {backTo ? (
            <Button asChild variant="outline" size="icon" className={`${HEADER_ICON_CLASSES} bg-card`}>
              <Link to={backTo} replace aria-label="Atrás" onClick={handleBackClick}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </Link>
            </Button>
          ) : Icon && (
            <span className={`${HEADER_ICON_CLASSES} flex items-center justify-center bg-primary text-primary-foreground`}>
              <Icon className="size-5" aria-hidden="true" />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {title}
            </h1>
            {description && <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">{description}</p>}
          </div>
        </div>

        {(action || reserveActionSpace || backTo) && (
          <div className="hidden min-h-11 shrink-0 items-center gap-2 lg:flex">{action}</div>
        )}
      </div>

      {children}
    </div>
  );
}
