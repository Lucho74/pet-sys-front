import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { STATUS_BADGE_CLASSES, STATUS_LABELS } from './types';
import type { Consultation } from './types';
import { formatDate } from '../../utils/datetime';

interface ListProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: string;
  createTo: string;
  itemTo: (consultationId: number) => string;
}

export function List({ consultations, isLoading, error, createTo, itemTo }: ListProps) {
  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4">
        {isLoading ? (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[14px] font-medium text-[#27374D] shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9DB2BF] border-t-[#27374D]" />
              Cargando consultas...
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-2">
            <div className="w-full rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] p-4 text-center text-[14px] text-[#7a1d1d] shadow-sm">
              {error}
            </div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-2">
            <div className="w-full rounded-2xl border border-dashed border-[#9DB2BF] bg-white p-5 text-center text-[14px] text-[#526D82] shadow-sm">
              No hay consultas cargadas.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {consultations.map((consultation) => (
              <Link
                key={consultation.id}
                to={itemTo(consultation.id)}
                className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(39,55,77,0.06)]"
              >
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
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-x-4 bottom-7">
        <Link
          to={createTo}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#27374D] px-4 py-[15px] shadow-[0_6px_16px_rgba(39,55,77,0.35)]"
        >
          <Plus size={15} strokeWidth={2.4} className="text-[#DDE6ED]" />
          <span className="text-[15px] font-semibold text-[#DDE6ED]">Nueva consulta</span>
        </Link>
      </div>
    </>
  );
}
