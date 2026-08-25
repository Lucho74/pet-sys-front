import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import type { IUserResponse } from '../../services/users/IUser';

const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 8;
const MAX_DNI_LENGTH = 20;

interface OwnerSelectProps {
  label: string;
  owners: IUserResponse[];
  value: string;
  onChange: (ownerId: string) => void;
  isLoadingOwners?: boolean;
  ownersError?: string;
  error?: string;
  disabled?: boolean;
}

export function OwnerSelect({
  label,
  owners,
  value,
  onChange,
  isLoadingOwners = false,
  ownersError = '',
  error,
  disabled = false,
}: OwnerSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = owners.find((owner) => String(owner.id) === value) ?? null;
  const selectedDni = selected?.dni ?? '';
  const selectedName = selected?.fullName ?? 'Sin nombre';
  const displayValue = isOpen ? query : selectedDni;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [isOpen]);

  const isShowingSelection = selected !== null && query === selectedDni;
  const search = isShowingSelection ? '' : query.trim();
  const hasSearch = search.length >= MIN_SEARCH_LENGTH;

  const matches = hasSearch
    ? owners.filter((owner) => owner.dni?.includes(search))
    : [];

  const visibleOwners = matches.slice(0, MAX_RESULTS);
  const hiddenCount = matches.length - visibleOwners.length;

  const handleType = (text: string) => {
    setQuery(text);
    setIsOpen(true);

    if (value) {
      onChange('');
    }
  };

  const handleSelect = (owner: IUserResponse) => {
    onChange(String(owner.id));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          value={displayValue}
          onChange={(event) => handleType(event.target.value)}
          onFocus={(event) => {
            setQuery(selectedDni);
            setIsOpen(true);
            event.target.select();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false);
          }}
          placeholder="Escribe el DNI del dueño"
          inputMode="numeric"
          maxLength={MAX_DNI_LENGTH}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          className={`w-full rounded-xl border bg-white py-[13px] pl-[14px] pr-[38px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? 'border-[#c0392b]' : 'border-[#9DB2BF]'
          }`}
        />

        {selected && !disabled ? (
          <button
            type="button"
            aria-label={`Quitar a ${selectedName} como dueño`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            className="absolute right-2 top-1/2 flex h-[26px] w-[26px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#526D82] transition-colors hover:bg-[#DDE6ED] hover:text-[#27374D]"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <ChevronDown
            size={17}
            strokeWidth={2}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9DB2BF]"
          />
        )}

        {isOpen ? (
          <div
            role="listbox"
            className="absolute inset-x-0 top-[calc(100%+4px)] z-30 max-h-[220px] overflow-auto rounded-xl border border-[#9DB2BF] bg-white py-1 shadow-[0_8px_20px_rgba(39,55,77,0.18)]"
          >
            {isLoadingOwners ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">Cargando clientes...</div>
            ) : ownersError ? (
              <div className="px-3.5 py-3 text-[14px] text-[#c0392b]">{ownersError}</div>
            ) : !hasSearch ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">
                Escribe al menos {MIN_SEARCH_LENGTH} números del DNI para buscar.
              </div>
            ) : matches.length === 0 ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">
                No se encontraron clientes con ese DNI.
              </div>
            ) : (
              <>
                {visibleOwners.map((owner) => {
                  const isSelected = String(owner.id) === value;

                  return (
                  <button
                      key={owner.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(owner)}
                      className="flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left hover:bg-[#DDE6ED]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-medium text-[#27374D]">
                          {owner.dni || 'Sin DNI'}
                        </div>
                        <div className="truncate text-[12px] text-[#526D82]">{owner.fullName}</div>
                      </div>
                      {isSelected ? (
                        <Check size={16} strokeWidth={2.5} className="shrink-0 text-[#27374D]" />
                      ) : null}
                    </button>
                  );
                })}

                {hiddenCount > 0 ? (
                  <div className="border-t border-[#DDE6ED] px-3.5 py-2 text-[12px] text-[#526D82]">
                    y {hiddenCount} más. Sigue escribiendo para afinar la búsqueda.
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      {error ? <span className="text-[12px] leading-4 text-[#c0392b]">{error}</span> : null}
      {!error && selected ? (
        <span className="text-[12px] leading-4 text-[#526D82]">Dueño: {selectedName}</span>
      ) : null}
    </div>
  );
}
