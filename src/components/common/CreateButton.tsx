import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface CreateButtonProps {
  to: string;
  label: string;
  variant?: 'bar' | 'header';
}

export function CreateButton({ to, label, variant = 'bar' }: CreateButtonProps) {
  const isHeader = variant === 'header';

  return (
    <Link
      to={to}
      className={
        isHeader
          ? 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#DDE6ED] px-4 py-2.5 text-[14px] font-semibold text-[#27374D] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDE6ED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27374D]'
          : 'flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#27374D] px-4 py-[15px] text-[15px] font-semibold text-[#DDE6ED] shadow-[0_6px_16px_rgba(39,55,77,0.35)] transition-colors hover:bg-[#1d2b3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2'
      }
    >
      <Plus size={isHeader ? 16 : 15} strokeWidth={2.4} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
