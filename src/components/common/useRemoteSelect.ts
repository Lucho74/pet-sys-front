import { useEffect, useState } from 'react';

interface Option {
  id: string;
  primary: string;
  secondary: string;
}

interface RemoteSelectConfig {
  value: string;
  onChange: (id: string) => void;
  searchOptions: (query: string) => Promise<Option[]>;
  loadOption: (id: string) => Promise<Option>;
  missingLabel: string;
  minSearchLength?: number;
}

export function useRemoteSelect({ value, onChange, searchOptions, loadOption, missingLabel, minSearchLength = 2 }: RemoteSelectConfig) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Option[] | 'error' | null>(null);
  const [selection, setSelection] = useState<Option>();
  const selectedOption = selection?.id === value ? selection : undefined;
  const options = Array.isArray(results) ? results : [];

  useEffect(() => {
    if (!value || selectedOption) return;

    let active = true;
    loadOption(value)
      .then((option) => {
        if (active) setSelection(option);
      })
      .catch(() => {
        if (active) setSelection({ id: value, primary: missingLabel, secondary: '' });
      });

    return () => { active = false; };
  }, [value, selectedOption, loadOption, missingLabel]);

  useEffect(() => {
    if (query.length < minSearchLength) return;

    let active = true;
    const timer = setTimeout(() => {
      searchOptions(query)
        .then((items) => { if (active) setResults(items); })
        .catch(() => { if (active) setResults('error'); });
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, searchOptions, minSearchLength]);

  return {
    options,
    selectedOption,
    onChange: (id: string) => {
      setSelection(options.find((option) => option.id === id));
      onChange(id);
    },
    onRemoteSearch: (search: string) => {
      if (search === query) return;
      setQuery(search);
      setResults(null);
    },
    minSearchLength,
    isLoading: query.length >= minSearchLength && results === null,
    loadError: results === 'error' ? 'No se pudo completar la búsqueda.' : '',
  };
}
