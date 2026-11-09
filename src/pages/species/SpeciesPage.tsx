import { useEffect, useState } from 'react';
import { Tags } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { CatalogTable } from '../../components/species/CatalogTable';
import { DEFAULT_QUERY, EMPTY_PAGINATION, type IPaginatedResponse, type PageQuery } from '../../services/IPaginated';
import type { BreedQuery, IBreed, ISpecies } from '../../services/species/ISpecies';
import {
  handleAddBreed,
  handleAddSpecies,
  handleDeleteBreed,
  handleDeleteSpecies,
  handleGetBreedsPage,
  handleGetSpeciesPage,
  handleUpdateBreed,
  handleUpdateSpecies,
} from '../../services/species/speciesService';

const EMPTY_PAGE = { ...EMPTY_PAGINATION, items: [] };

export function SpeciesPage() {
  const [speciesQuery, setSpeciesQuery] = useState<PageQuery>({ ...DEFAULT_QUERY, sortBy: 'name' });
  const [speciesPage, setSpeciesPage] = useState<IPaginatedResponse<ISpecies>>(EMPTY_PAGE);
  const [selected, setSelected] = useState<ISpecies | null>(null);
  const [breedQuery, setBreedQuery] = useState<BreedQuery>({ ...DEFAULT_QUERY, sortBy: 'name' });
  const [breedPage, setBreedPage] = useState<IPaginatedResponse<IBreed>>(EMPTY_PAGE);
  const [speciesLoadedFor, setSpeciesLoadedFor] = useState<PageQuery | null>(null);
  const [breedLoadedFor, setBreedLoadedFor] = useState<BreedQuery | null>(null);
  const [speciesReload, setSpeciesReload] = useState(0);
  const [breedReload, setBreedReload] = useState(0);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      handleGetSpeciesPage(speciesQuery)
        .then((response) => active && setSpeciesPage(response))
        .catch(() => active && toast.error('No se pudo cargar la lista de especies.'))
        .finally(() => active && setSpeciesLoadedFor(speciesQuery));
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [speciesQuery, speciesReload]);

  useEffect(() => {
    if (!breedQuery.speciesId) return;
    let active = true;
    const timer = setTimeout(() => {
      handleGetBreedsPage(breedQuery)
        .then((response) => active && setBreedPage(response))
        .catch(() => active && toast.error('No se pudo cargar la lista de razas.'))
        .finally(() => active && setBreedLoadedFor(breedQuery));
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [breedQuery, breedReload]);

  const selectSpecies = (species: ISpecies) => {
    setSelected(species);
    setBreedPage(EMPTY_PAGE);
    setBreedQuery({ ...DEFAULT_QUERY, sortBy: 'name', speciesId: species.id });
  };

  const saveSpecies = async (id: number | null, name: string) => {
    if (id) {
      const updated = await handleUpdateSpecies(id, name);
      if (selected?.id === id) setSelected(updated);
      toast.success('Especie renombrada.');
    } else {
      const created = await handleAddSpecies(name);
      selectSpecies(created);
      toast.success('Especie creada con la raza "No especificada".');
    }
    setSpeciesReload((n) => n + 1);
  };

  const deleteSpecies = async (species: ISpecies) => {
    await handleDeleteSpecies(species.id);
    if (selected?.id === species.id) setSelected(null);
    toast.success('Especie borrada.');
    setSpeciesReload((n) => n + 1);
  };

  const saveBreed = async (id: number | null, name: string) => {
    if (id) {
      await handleUpdateBreed(id, name);
      toast.success('Raza renombrada.');
    } else {
      await handleAddBreed(name, selected!.id);
      toast.success('Raza creada.');
    }
    setBreedReload((n) => n + 1);
  };

  const deleteBreed = async (breed: IBreed) => {
    await handleDeleteBreed(breed.id, breed.speciesId);
    toast.success('Raza borrada.');
    setBreedReload((n) => n + 1);
  };

  return (
    <ScreenShell title="Especies y razas" icon={Tags} homeTo="/" reserveActionSpace>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <CatalogTable
            title="Especies"
            itemLabel="especie"
            deleteWarning="También se borran sus razas. No se puede si alguna está asignada a una mascota."
            page={speciesPage}
            isLoading={speciesLoadedFor !== speciesQuery}
            query={speciesQuery}
            onQueryChange={setSpeciesQuery}
            selectedId={selected?.id}
            onSelect={selectSpecies}
            onSave={saveSpecies}
            onDelete={deleteSpecies}
          />

          {selected ? (
            <CatalogTable
              title={`Razas de ${selected.name}`}
              itemLabel="raza"
              deleteWarning="No se puede si está asignada a una mascota o si es la última raza de la especie."
              page={breedPage}
              isLoading={breedLoadedFor !== breedQuery}
              query={breedQuery}
              onQueryChange={(query) => setBreedQuery({ ...query, speciesId: selected.id })}
              onSave={saveBreed}
              onDelete={deleteBreed}
            />
          ) : (
            <p className="self-center text-center text-[14px] text-[#526D82]">Elegí una especie para ver sus razas.</p>
          )}
        </div>
      </div>
    </ScreenShell>
  );
}
