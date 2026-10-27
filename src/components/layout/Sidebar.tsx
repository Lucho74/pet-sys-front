import { NavLink } from 'react-router-dom';
import { getVisibleNavItems } from './navigation';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from '../users/userTypes';

export function Sidebar() {
  const { role } = useAuth();

  const visibleItems = getVisibleNavItems(role);

  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-[#27374D] px-4 py-7 lg:flex">
      <div className="mb-9 flex items-center gap-3 px-2">
        <img
          src="/4patas-logo-azul.png"
          alt=""
          className="h-11 w-11 shrink-0 rounded-2xl bg-white object-contain p-0.5"
        />
        <div className="min-w-0">
          <div className="truncate text-[18px] font-extrabold tracking-[-0.2px] text-white">4 Patas</div>
          <div className="truncate text-[13px] font-semibold text-[#9DB2BF]">{role ? ROLE_LABELS[role] : ''}</div>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex flex-col gap-1.5">
        {visibleItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED] ${
                isActive ? 'bg-[#536FBA] text-white' : 'text-[#9DB2BF] hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={19} strokeWidth={2.2} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
