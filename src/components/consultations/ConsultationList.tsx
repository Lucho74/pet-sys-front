import type { Consultation } from './consultationTypes';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListState } from '../common/ListState';
import { ConsultationTable } from './ConsultationTable';
import type { PageQuery, Pagination } from '../../services/IPaginated';

interface ConsultationListProps {
  consultations: Consultation[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  query: PageQuery;
  onQueryChange: (query: PageQuery) => void;
  pagination: Pagination;
}

export function ConsultationList({
  consultations,
  isLoading,
  error,
  createTo,
  createLabel,
  query,
  onQueryChange,
  pagination,
}: ConsultationListProps) {

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {!isLoading && !error ? (
            <ConsultationTable
              consultations={consultations}
              query={query}
              onQueryChange={onQueryChange}
              pagination={pagination}
            />
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={false}
              loadingLabel="Cargando consultas..."
              emptyLabel=""
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
