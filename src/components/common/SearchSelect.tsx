import { useId, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  onRemoteSearch: (search: string) => void;
  minSearchLength: number;
  selectedOption?: SearchSelectOption;
  placeholder: string;
  searchHint: string;
  loadingLabel: string;
  notFoundLabel: string;
  isLoading?: boolean;
  loadError?: string;
  error?: string;
  disabled?: boolean;
}

export function SearchSelect({
  label,
  options,
  value,
  onChange,
  onRemoteSearch,
  minSearchLength,
  selectedOption,
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

  const hasSearch = search.trim().length >= minSearchLength;

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    onRemoteSearch(nextSearch.trim());
  };

  let message = hasSearch ? notFoundLabel : searchHint;
  if (isLoading) {
    message = loadingLabel;
  } else if (loadError) {
    message = loadError;
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Popover open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) handleSearchChange('');
      }}>
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
            {selectedOption ? (
              <span className="truncate">
                {selectedOption.primary} {selectedOption.secondary && `· ${selectedOption.secondary}`}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
          <Command shouldFilter={false}>
            <CommandInput placeholder={placeholder} value={search} onValueChange={handleSearchChange} />
            <CommandList>
              <CommandEmpty>{message}</CommandEmpty>
              {hasSearch && options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={String(option.id)}
                  onSelect={() => {
                    onChange(String(option.id));
                    setOpen(false);
                    handleSearchChange('');
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
