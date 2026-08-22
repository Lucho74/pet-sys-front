import { Link } from 'react-router-dom';
import { ChevronRight, PawPrint, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Section {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const sections: Section[] = [
  {
    to: '/users',
    title: 'Usuarios',
    description: 'Alta, edición y baja de usuarios',
    icon: Users,
  },
  {
    to: '/pets',
    title: 'Mascotas',
    description: 'Alta, edición y baja de mascotas',
    icon: PawPrint,
  },
];

export function Home() {
  return (
    <div className="flex min-h-screen w-full bg-[#e9edf1]">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#DDE6ED] font-sans">
        <div className="flex-none bg-[#27374D] px-5 pb-4 pt-14">
          <div className="mt-3.5 flex flex-col gap-0.5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
              Sysadmin
            </div>
            <div className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED]">
              Panel
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 pb-6 pt-4">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Gestión
          </div>

          <div className="flex flex-col gap-2.5">
            {sections.map(({ to, title, description, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(39,55,77,0.06)]"
              >
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D]">
                  <Icon size={22} strokeWidth={2} className="text-[#DDE6ED]" />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-[15px] font-semibold text-[#27374D]">{title}</div>
                  <div className="truncate text-[13px] text-[#526D82]">{description}</div>
                </div>

                <ChevronRight size={18} strokeWidth={2} className="shrink-0 text-[#9DB2BF]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
