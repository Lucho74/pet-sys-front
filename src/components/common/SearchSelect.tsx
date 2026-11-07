import { useId, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { matchesSearch } from '../../utils/search';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const MIN_SEARCH_LENGTH = 2;

interface SearchSelectOption {
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
  isLoading?: boolean;
  loadError?: string;
  error?: string;
  disabled?: boolean;
}

// Combobox de shadcn (Popover + Command). Filtra por `primary` ignorando mayúsculas y acentos.
export function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  searchHint,
  loadingLabel,
  notFoundLabel,
  isLoading = false,
  loadError = '',
  error,
  disabled = false,
}: SearchSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selected = options.find((option) => String(option.id) === value);
  const hasSearch = search.trim().length >= MIN_SEARCH_LENGTH;
  const matches = hasSearch ? options.filter((option) => matchesSearch(option.primary, search.trim())) : [];

  // Lo que se muestra cuando no hay opciones para elegir.
  const message = isLoading ? loadingLabel : loadError || (hasSearch ? notFoundLabel : searchHint);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={Boolean(error)}
            disabled={disabled}
            className="h-10 w-full justify-between bg-white font-normal"
          >
            {selected ? (
              <span className="truncate">
                {selected.primary} {selected.secondary && `· ${selected.secondary}`}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput placeholder={placeholder} value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>{message}</CommandEmpty>
              {matches.map((option) => (
                <CommandItem
                  key={option.id}
                  value={String(option.id)}
                  onSelect={() => {
                    onChange(String(option.id));
                    setOpen(false);
                    setSearch('');
                  }}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{option.primary}</div>
                    {option.secondary && <div className="truncate text-xs text-muted-foreground">{option.secondary}</div>}
                  </div>
                  {String(option.id) === value && <Check className="ml-auto" />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
