import { Search, X } from 'lucide-react';
import { controlClasses } from './fieldStyles';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="flex-none px-4 pt-4 lg:px-10 lg:pt-8">
      <div className="relative lg:max-w-[460px]">
        <Search
          size={17}
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#526D82]"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          className={`[&::-webkit-search-cancel-button]:hidden ${controlClasses(false, 'pl-[38px] pr-[38px] py-[13px] lg:py-[11px]')}`}
        />
        {value ? (
          <button
            type="button"
            aria-label="Borrar búsqueda"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 flex h-[26px] w-[26px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#526D82] transition-colors hover:bg-[#DDE6ED] hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D]"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
