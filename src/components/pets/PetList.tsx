import { Link } from 'react-router-dom';
import type { Pet } from './petTypes';
import { initials } from '../../utils/initials';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { CARD_CLASSES, GRID_CLASSES } from '../common/listStyles';

interface ListProps {
  pets: Pet[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  itemTo: (petId: number) => string;
}

export function List({ pets, isLoading, error, createTo, createLabel, itemTo }: ListProps) {
  const hasPets = !isLoading && !error && pets.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasPets ? (
            <ul className={GRID_CLASSES}>
              {pets.map((pet) => (
                <li key={pet.id} className="flex">
                  <Link to={itemTo(pet.id)} className={CARD_CLASSES}>
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D]">
                      <span className="text-[15px] font-semibold text-white">{initials(pet.name)}</span>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-[15px] font-semibold text-[#27374D]">{pet.name}</div>
                      <div className="truncate text-[13px] text-[#526D82]">{pet.specie} · {pet.breed}</div>
                      {pet.birthDate ? (
                        <div className="truncate text-[12px] text-[#526D82]">Nacimiento: {pet.birthDate}</div>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={pets.length === 0}
              loadingLabel="Cargando mascotas..."
              emptyLabel="No hay mascotas cargadas."
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-7 lg:hidden">
        <CreateButton to={createTo} label={createLabel} />
      </div>
    </>
  );
}
