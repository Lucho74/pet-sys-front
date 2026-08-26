import { Link } from 'react-router-dom';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './types';
import type { Consultation } from './types';
import { formatDate } from '../../utils/datetime';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { CARD_CLASSES, WIDE_GRID_CLASSES } from '../common/listStyles';

interface ListProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  itemTo: (consultationId: number) => string;
}

export function List({
  consultations,
  isLoading,
  error,
  createTo,
  createLabel,
  itemTo,
}: ListProps) {
  const hasConsultations = !isLoading && !error && consultations.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasConsultations ? (
            <ul className={WIDE_GRID_CLASSES}>
              {consultations.map((consultation) => (
                <li key={consultation.id} className="flex">
                  <Link to={itemTo(consultation.id)} className={CARD_CLASSES}>
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D]">
                      <span className="text-[15px] font-semibold text-white">{consultation.id}</span>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold text-[#27374D]">
                          {consultation.description}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            STATUS_BADGE_CLASSES[consultation.status]
                          }`}
                        >
                          {STATUS_LABELS[consultation.status]}
                        </span>
                      </div>
                      <div className="truncate text-[13px] text-[#526D82]">
                        {consultation.date ? formatDate(consultation.date) : 'Sin fecha asignada'}
                      </div>
                      <div className="truncate text-[12px] text-[#526D82]">
                        Mascota: {consultation.petName} · Veterinario: {consultation.veterinarianName}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={consultations.length === 0}
              loadingLabel="Cargando consultas..."
              emptyLabel="No hay consultas cargadas."
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
