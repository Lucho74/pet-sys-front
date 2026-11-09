import { useEffect, useId, useState } from 'react';
import { handleGetAllSpecies, handleGetBreedsBySpecies } from '../../services/species/speciesService';
import type { IBreed, ISpecies } from '../../services/species/ISpecies';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SpeciesBreedSelectProps {
  speciesId: string;
  breedId: string;
  onSpeciesChange: (speciesId: string) => void;
  onBreedChange: (breedId: string) => void;
  speciesError?: string;
  breedError?: string;
  disabled?: boolean;
}

export function SpeciesBreedSelect({
  speciesId,
  breedId,
  onSpeciesChange,
  onBreedChange,
  speciesError,
  breedError,
  disabled = false,
}: SpeciesBreedSelectProps) {
  const speciesFieldId = useId();
  const breedFieldId = useId();
  const [species, setSpecies] = useState<ISpecies[]>([]);
  const [breeds, setBreeds] = useState<IBreed[]>([]);

  useEffect(() => {
    handleGetAllSpecies()
      .then((response) => setSpecies(response.toSorted((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setSpecies([]));
  }, []);

  useEffect(() => {
    if (!speciesId) return;
    handleGetBreedsBySpecies(Number(speciesId))
      .then((response) => setBreeds(response.toSorted((a, b) => a.name.localeCompare(b.name))))
      .catch(() => setBreeds([]));
  }, [speciesId]);

  return (
    <>
      <Field data-invalid={Boolean(speciesError)}>
        <FieldLabel htmlFor={speciesFieldId}>Especie</FieldLabel>
        <Select value={speciesId} onValueChange={onSpeciesChange} disabled={disabled}>
          <SelectTrigger id={speciesFieldId} size="form" className="bg-white" aria-invalid={Boolean(speciesError)}>
            <SelectValue placeholder="Elegí una especie" />
          </SelectTrigger>
          <SelectContent>
            {species.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {speciesError && <FieldError>{speciesError}</FieldError>}
      </Field>

      <Field data-invalid={Boolean(breedError)}>
        <FieldLabel htmlFor={breedFieldId}>Raza</FieldLabel>
        <Select value={breedId} onValueChange={onBreedChange} disabled={disabled || !speciesId}>
          <SelectTrigger id={breedFieldId} size="form" className="bg-white" aria-invalid={Boolean(breedError)}>
            <SelectValue placeholder={speciesId ? 'Elegí una raza' : 'Primero elegí la especie'} />
          </SelectTrigger>
          <SelectContent>
            {breeds.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {breedError && <FieldError>{breedError}</FieldError>}
      </Field>
    </>
  );
}
