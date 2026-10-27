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
          ? 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#536FBA] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#435FA9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#536FBA] focus-visible:ring-offset-2'
          : 'flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#536FBA] px-4 py-[15px] text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(83,111,186,0.35)] transition-colors hover:bg-[#435FA9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#536FBA] focus-visible:ring-offset-2'
      }
    >
      <Plus size={isHeader ? 17 : 18} strokeWidth={2.6} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
