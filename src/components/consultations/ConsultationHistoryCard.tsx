import { useEffect, useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemActions, ItemContent, ItemDescription } from '@/components/ui/item';
import { ListState } from '../common/ListState';
import { DETAIL_LIST_LINK_CLASSES, TABLE_CARD_CLASSES } from '../common/listStyles';
import type { IConsultationResponse } from '../../services/consultation/IConsultation';
import { handleGetConsultationsByPet, handleGetConsultationsByVeterinarian } from '../../services/consultation/consultationService';
import { formatDate, hasDateTime } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

interface ConsultationHistoryCardProps {
  source: 'pet' | 'veterinarian';
  id: number;
  detailBase?: string;
  action?: ReactNode;
}

export function ConsultationHistoryCard({ source, id, detailBase = '/consultations', action }: ConsultationHistoryCardProps) {
  const headingId = useId();
  const [consultations, setConsultations] = useState<IConsultationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadConsultations = source === 'pet' ? handleGetConsultationsByPet : handleGetConsultationsByVeterinarian;
    loadConsultations(id)
      .then((response) => {
        if (active) setConsultations(response);
      })
      .catch((error) => {
        if (active) setError(errorMessage(error, 'No se pudieron cargar las consultas.'));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, source]);

  const visits = consultations.map((consultation) => ({
    ...consultation,
    date: hasDateTime(consultation.date) ? consultation.date : '',
  })).sort((first, second) => second.date.localeCompare(first.date) || second.id - first.id);

  return (
    <Card className={`${TABLE_CARD_CLASSES} gap-0 py-0 ring-0`}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDE6ED] px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <h2 id={headingId}>{source === 'pet' ? 'Historial de consultas' : 'Consultas asignadas'}</h2>
          {!isLoading && !error && visits.length > 0 && <Badge variant="secondary">{visits.length}</Badge>}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading || error || visits.length === 0 ? (
          <div className="px-5 py-4">
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={visits.length === 0}
              loadingLabel="Cargando consultas..."
              emptyLabel={source === 'pet' ? 'Esta mascota todavía no tiene consultas.' : 'Este profesional todavía no tiene consultas asignadas.'}
            />
          </div>
        ) : (
          <ul aria-labelledby={headingId} className="divide-y divide-[#DDE6ED]">
            {visits.map((consultation) => (
              <li key={consultation.id}>
                <Item
                  asChild
                  className={`${DETAIL_LIST_LINK_CLASSES} items-start ${
                    consultation.isSuspended ? 'bg-muted/30 text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  <Link to={`${detailBase}/${consultation.id}`}>
                    <ItemContent className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="wrap-anywhere text-[15px] font-semibold">{consultation.title?.trim() || 'Sin título'}</h3>
                        {consultation.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                      </div>
                      <ItemDescription className="wrap-anywhere leading-[inherit]">
                        {consultation.description?.trim() || 'Sin descripción'}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="shrink-0 pt-0.5 text-sm tabular-nums text-muted-foreground">
                      {consultation.date ? (
                        <time dateTime={consultation.date}>{formatDate(consultation.date)}</time>
                      ) : (
                        <span>Sin fecha</span>
                      )}
                      <ChevronRight className="size-4 transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                    </ItemActions>
                  </Link>
                </Item>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
