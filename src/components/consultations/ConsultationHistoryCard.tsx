import { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListState } from '../common/ListState';
import { TABLE_CARD_CLASSES, TABLE_HEAD_CLASSES, TABLE_HEADER_ROW_CLASSES, TABLE_ROW_CLASSES } from '../common/listStyles';
import type { IConsultationResponse } from '../../services/consultation/IConsultation';
import { handleGetConsultationsByPet, handleGetConsultationsByVeterinarian } from '../../services/consultation/consultationService';
import { formatDate, hasDateTime } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

interface ConsultationHistoryCardProps {
  source: 'pet' | 'veterinarian';
  id: number;
  detailBase?: string;
}

export function ConsultationHistoryCard({ source, id, detailBase = '/consultations' }: ConsultationHistoryCardProps) {
  const navigate = useNavigate();
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
      <CardHeader className="px-4 py-4">
        <CardTitle><h2 id={headingId}>{source === 'pet' ? 'Historial de consultas' : 'Consultas asignadas'}</h2></CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading || error || visits.length === 0 ? (
          <div className="px-4 pb-4">
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={visits.length === 0}
              loadingLabel="Cargando consultas..."
              emptyLabel={source === 'pet' ? 'Esta mascota todavía no tiene consultas.' : 'Este profesional todavía no tiene consultas asignadas.'}
            />
          </div>
        ) : (
          <Table className="table-fixed" aria-labelledby={headingId}>
            <TableHeader>
              <TableRow className={TABLE_HEADER_ROW_CLASSES}>
                <TableHead scope="col" className={TABLE_HEAD_CLASSES}>Consulta</TableHead>
                <TableHead scope="col" className={`${TABLE_HEAD_CLASSES} w-28`}>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((consultation) => (
                <TableRow
                  key={consultation.id}
                  onClick={() => navigate(`${detailBase}/${consultation.id}`)}
                  className={`${TABLE_ROW_CLASSES} cursor-pointer ${
                    consultation.isSuspended ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'
                  }`}
                >
                  <TableCell className="space-y-1 px-4 py-3 align-top whitespace-normal">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="wrap-anywhere font-semibold">
                        <Link
                          to={`${detailBase}/${consultation.id}`}
                          className="rounded-sm no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {consultation.title?.trim() || 'Sin título'}
                        </Link>
                      </h3>
                      {consultation.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                    </div>
                    <p className="whitespace-pre-wrap wrap-anywhere text-muted-foreground">
                      {consultation.description?.trim() || 'Sin descripción'}
                    </p>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top tabular-nums">
                    {consultation.date ? (
                      <time dateTime={consultation.date}>{formatDate(consultation.date)}</time>
                    ) : (
                      <span className="text-muted-foreground">Sin fecha</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
