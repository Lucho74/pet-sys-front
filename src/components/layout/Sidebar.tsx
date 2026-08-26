import { NavLink } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { NAV_ITEMS } from './navigation';

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#27374D]/15 bg-[#27374D] px-4 py-7 lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#526D82]">
          <PawPrint size={19} strokeWidth={2} className="text-[#DDE6ED]" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold tracking-[-0.2px] text-[#DDE6ED]">Pet System</div>
          <div className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
            Sysadmin
          </div>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED] ${
                isActive
                  ? 'bg-[#526D82] text-[#DDE6ED]'
                  : 'text-[#9DB2BF] hover:bg-[#526D82]/45 hover:text-[#DDE6ED]'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
