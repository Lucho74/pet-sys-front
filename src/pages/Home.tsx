import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ScreenShell } from '../components/layout/ScreenShell';
import { NAV_ITEMS } from '../components/layout/navigation';

const sections = NAV_ITEMS.filter((item) => item.to !== '/');

export function Home() {
  return (
    <ScreenShell eyebrow="Sysadmin" title="Panel">
      <div className="flex-1 overflow-auto px-4 pb-6 pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="w-full">
          <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Gestión
          </h2>

          <ul className="grid gap-2.5 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
            {sections.map(({ to, label, description, icon: Icon }) => (
              <li key={to} className="flex">
                <Link
                  to={to}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(39,55,77,0.06)] transition-[border-color,box-shadow,transform] hover:border-[#9DB2BF] hover:shadow-[0_6px_16px_rgba(39,55,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:flex-col lg:items-start lg:gap-4 lg:p-6 lg:hover:-translate-y-px"
                >
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D] lg:h-[52px] lg:w-[52px] lg:rounded-[14px]">
                    <Icon size={22} strokeWidth={2} className="text-[#DDE6ED]" aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-[15px] font-semibold text-[#27374D] lg:text-[17px]">
                      {label}
                    </div>
                    <div className="truncate text-[13px] text-[#526D82] lg:whitespace-normal lg:text-[14px]">
                      {description}
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    strokeWidth={2}
                    className="shrink-0 text-[#9DB2BF] lg:hidden"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScreenShell>
  );
}
