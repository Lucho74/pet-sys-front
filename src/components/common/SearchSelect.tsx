import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { matchesSearch } from '../../utils/search';
import {
  controlClasses,
  FIELD_ERROR_CLASSES,
  FIELD_HINT_CLASSES,
  FIELD_LABEL_CLASSES,
} from './fieldStyles';

export const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 8;

export interface SearchSelectOption {
  id: number | string;
  primary: string;
  secondary: string;
}

interface SearchSelectProps {
  label: string;
  options: SearchSelectOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  searchHint: string;
  loadingLabel: string;
  notFoundLabel: string;
  emptyPrimaryLabel: string;
  emptySecondaryLabel: string;
  selectedHint?: string;
  clearLabel: string;
  isLoading?: boolean;
  loadError?: string;
  error?: string;
  disabled?: boolean;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
}

export function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  searchHint,
  loadingLabel,
  notFoundLabel,
  emptyPrimaryLabel,
  emptySecondaryLabel,
  selectedHint,
  clearLabel,
  isLoading = false,
  loadError = '',
  error,
  disabled = false,
  inputMode = 'text',
  maxLength,
}: SearchSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fieldId = useId();
  const listId = `${fieldId}-list`;
  const errorId = `${fieldId}-error`;

  const selected = options.find((option) => String(option.id) === value) ?? null;
  const selectedPrimary = selected?.primary ?? '';
  const displayValue = isOpen ? query : selectedPrimary;

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

  const isShowingSelection = selected !== null && query === selectedPrimary;
  const search = isShowingSelection ? '' : query.trim();
  const hasSearch = search.length >= MIN_SEARCH_LENGTH;

  const matches = hasSearch ? options.filter((option) => matchesSearch(option.primary, search)) : [];
  const visibleOptions = matches.slice(0, MAX_RESULTS);
  const hiddenCount = matches.length - visibleOptions.length;

  const highlightedIndex = visibleOptions.length
    ? Math.min(activeIndex, visibleOptions.length - 1)
    : -1;
  const highlightedOption = highlightedIndex >= 0 ? visibleOptions[highlightedIndex] : null;

  const handleType = (text: string) => {
    setQuery(text);
    setActiveIndex(0);
    setIsOpen(true);

    if (value) {
      onChange('');
    }
  };

  const handleSelect = (option: SearchSelectOption) => {
    onChange(String(option.id));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    setActiveIndex(0);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      setIsOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      if (visibleOptions.length === 0) return;

      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex(
        (current) =>
          (Math.min(current, visibleOptions.length - 1) + step + visibleOptions.length) %
          visibleOptions.length,
      );
      return;
    }

    if (event.key === 'Enter' && isOpen) {
      event.preventDefault();

      if (highlightedOption) {
        handleSelect(highlightedOption);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label htmlFor={fieldId} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>

      <div className="relative">
        <input
          id={fieldId}
          ref={inputRef}
          value={displayValue}
          onChange={(event) => handleType(event.target.value)}
          onFocus={(event) => {
            setQuery(selectedPrimary);
            setActiveIndex(0);
            setIsOpen(true);
            event.target.select();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && highlightedOption ? `${listId}-${highlightedIndex}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          className={controlClasses(Boolean(error), 'pl-[14px] pr-[38px] py-[13px] lg:py-[11px]')}
        />

        {selected && !disabled ? (
          <button
            type="button"
            aria-label={clearLabel}
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            className="absolute right-2 top-1/2 flex h-[26px] w-[26px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#526D82] transition-colors hover:bg-[#DDE6ED] hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D]"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        ) : (
          <ChevronDown
            size={17}
            strokeWidth={2}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9DB2BF]"
          />
        )}

        {isOpen ? (
          <div
            id={listId}
            role="listbox"
            aria-label={label}
            className="absolute inset-x-0 top-[calc(100%+4px)] z-30 max-h-[220px] overflow-auto rounded-xl border border-[#9DB2BF] bg-white py-1 shadow-[0_8px_20px_rgba(39,55,77,0.18)]"
          >
            {isLoading ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">{loadingLabel}</div>
            ) : loadError ? (
              <div className="px-3.5 py-3 text-[14px] text-[#c0392b]">{loadError}</div>
            ) : !hasSearch ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">{searchHint}</div>
            ) : matches.length === 0 ? (
              <div className="px-3.5 py-3 text-[14px] text-[#526D82]">{notFoundLabel}</div>
            ) : (
              <>
                {visibleOptions.map((option, index) => {
                  const isSelected = String(option.id) === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={option.id}
                      id={`${listId}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                      ref={(node) => {
                        if (isHighlighted) node?.scrollIntoView({ block: 'nearest' });
                      }}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(option)}
                      className={`flex w-full cursor-pointer items-center gap-2 px-3.5 py-2.5 text-left transition-colors ${
                        isHighlighted ? 'bg-[#DDE6ED]' : ''
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-medium text-[#27374D]">
                          {option.primary || emptyPrimaryLabel}
                        </div>
                        <div className="truncate text-[12px] text-[#526D82]">
                          {option.secondary || emptySecondaryLabel}
                        </div>
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

      {error ? (
        <span id={errorId} className={FIELD_ERROR_CLASSES}>
          {error}
        </span>
      ) : null}
      {!error && selected && selectedHint ? (
        <span className={FIELD_HINT_CLASSES}>{selectedHint}</span>
      ) : null}
    </div>
  );
}
