import type { Consultation } from './consultationTypes';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListState } from '../common/ListState';
import { ConsultationTable } from './ConsultationTable';
import { activeFirst } from '../common/listStyles';
import type { Pagination } from '../../services/IPaginated';

interface ConsultationListProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export function ConsultationList({
  consultations,
  isLoading,
  error,
  createTo,
  createLabel,
  pagination,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: ConsultationListProps) {
  const hasConsultations = !isLoading && !error && consultations.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasConsultations ? (
            <ConsultationTable
              consultations={activeFirst(consultations)}
              pagination={pagination}
              onPageChange={onPageChange}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
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
        <Button asChild size="lg" className="h-12 w-full shadow-[0_6px_16px_rgba(39,55,77,0.35)]">
          <Link to={createTo}>
            <Plus /> {createLabel}
          </Link>
        </Button>
      </div>
    </>
  );
}
