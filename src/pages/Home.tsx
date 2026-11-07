import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ScreenShell } from '../components/layout/ScreenShell';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getVisibleNavItems } from '../components/layout/navigation';
import { useAuth } from '../contexts/AuthenticationContext';

export function Home() {
  const { role } = useAuth();
  const sections = getVisibleNavItems(role).filter((item) => item.to !== '/');
  
  return (
    <ScreenShell title="Panel">
      <div className="flex-1 overflow-auto px-4 pb-6 pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="w-full">
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#27374D]">
            Gestión
          </h2>

          <ul className="grid gap-2.5 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
            {sections.map(({ to, label, description, icon: Icon }) => (
              <li key={to}>
                <Link to={to}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="flex items-center gap-3 lg:flex-col lg:items-start">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:size-13">
                        <Icon size={22} aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base lg:text-lg">{label}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                      </div>
                      <ChevronRight size={18} className="shrink-0 text-muted-foreground lg:hidden" aria-hidden="true" />
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScreenShell>
  );
}
