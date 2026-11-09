import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
interface ScreenShellProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backTo?: string;
  homeTo?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ScreenShell({ title, description, icon: Icon, backTo, action, children }: ScreenShellProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-1 flex-col overflow-hidden bg-[#DDE6ED] font-sans">
      <div className="flex flex-none flex-col gap-4 px-4 pt-5 sm:flex-row sm:items-end sm:justify-between lg:px-10 lg:pt-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 size-9 lg:hidden [&_svg]:size-5" />
          {backTo && (
            <Button asChild variant="outline" size="icon" className="bg-card">
              <Link to={backTo} aria-label="Atrás">
                <ChevronLeft />
              </Link>
            </Button>
          )}
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              {Icon && (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:size-10">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              )}
              {title}
            </h1>
            {description && <p className="mt-1 text-sm text-muted-foreground first-letter:uppercase">{description}</p>}
          </div>
        </div>

        {action && <div className="hidden shrink-0 items-center gap-2 lg:flex">{action}</div>}
      </div>

      {children}
    </div>
  );
}
