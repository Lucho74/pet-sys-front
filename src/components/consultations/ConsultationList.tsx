import { Link } from 'react-router-dom';
import type { Consultation } from './consultationTypes';
import { formatDate } from '../../utils/datetime';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { activeFirst, CARD_CLASSES, DELETED_BADGE_CLASSES, DELETED_CARD_CLASSES, WIDE_GRID_CLASSES } from '../common/listStyles';

interface ConsultationListProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  itemTo: (consultationId: number) => string;
}

export function ConsultationList({
  consultations,
  isLoading,
  error,
  createTo,
  createLabel,
  itemTo,
}: ConsultationListProps) {
  const hasConsultations = !isLoading && !error && consultations.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasConsultations ? (
            <ul className={WIDE_GRID_CLASSES}>
              {activeFirst(consultations).map((consultation) => (
                <li key={consultation.id} className="flex">
                  <Link to={itemTo(consultation.id)} className={consultation.isDeleted ? DELETED_CARD_CLASSES : CARD_CLASSES}>
                    <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full ${consultation.isDeleted ? 'bg-[#9DB2BF]' : 'bg-[#27374D]'}`}>
                      <span className={`text-[15px] font-semibold ${consultation.isDeleted ? 'text-[#27374D]' : 'text-white'}`}>{consultation.id}</span>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`truncate text-[15px] font-semibold ${consultation.isDeleted ? 'text-[#526D82]' : 'text-[#27374D]'}`}>
                          {consultation.description}
                        </span>
                        {consultation.isDeleted ? <span className={DELETED_BADGE_CLASSES}>Suspendido</span> : null}
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
              emptyLabel="Todavía no hay consultas. Creá la primera con «Nueva consulta»."
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
