import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Consultation } from './consultationTypes';
import { formatDate } from '../../utils/datetime';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  TABLE_ACTION_WIDTH,
  TABLE_CARD_CLASSES,
  TABLE_CELL_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_HEADER_ROW_CLASSES,
  TABLE_ROW_CLASSES,
} from '../common/listStyles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS, type Pagination } from '../../services/IPaginated';
import type { ConsultationQuery } from '../../services/consultation/IConsultation';
import { useAuth } from '../../contexts/AuthenticationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ConsultationTableProps {
  query: ConsultationQuery;
  onQueryChange: (query: ConsultationQuery) => void;
  onSuspend: (id: number) => Promise<void>;
  onReactivate: (id: number) => Promise<void>;
  pagination: Pagination;
  consultations: Consultation[];
}

type ColumnKey = 'description' | 'date' | 'petName' | 'veterinarianName';

const COLUMNS: { key: ColumnKey; label: string; width: number; sortBy?: string }[] = [
  { key: 'date', label: 'Fecha', sortBy: 'date', width: 120 },
  { key: 'description', label: 'Título', width: 256 },
  { key: 'petName', label: 'Mascota', width: 144 },
  { key: 'veterinarianName', label: 'Veterinario', width: 184 },
];

export function ConsultationTable({ query, onQueryChange, onSuspend, onReactivate, pagination, consultations: rows }: ConsultationTableProps) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [consultationToSuspend, setConsultationToSuspend] = useState<Consultation | null>(null);

  const columns = COLUMNS.filter((column) => !hidden.includes(column.key));
  const flexibleColumn = columns.find((column) => column.key === 'description') ?? columns[0];
  const minWidth = columns.reduce((width, column) => width + column.width, TABLE_ACTION_WIDTH);

  const handleSort = (sortBy: string) => {
    onQueryChange({ ...query, sortBy, sortDesc: query.sortBy === sortBy ? !query.sortDesc : false, pageIndex: 1 });
  };

  const renderCell = (consultation: Consultation, key: ColumnKey) => {
    if (key === 'date') return consultation.date ? formatDate(consultation.date) : 'Sin fecha';
    if (key === 'petName') {
      return <Badge variant="secondary" className="h-auto min-h-5 max-w-full whitespace-normal">{consultation.petName}</Badge>;
    }
    if (key === 'description') {
      return (
        <div className="flex items-center gap-2">
          <span className="min-w-0 font-semibold">{consultation.description}</span>
          {consultation.isSuspended && <Badge variant="outline">Suspendida</Badge>}
        </div>
      );
    }
    return consultation[key];
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          aria-label="Buscar consultas por título"
          placeholder="Buscar por título..."
          value={query.search}
          onChange={(event) => onQueryChange({ ...query, search: event.target.value, pageIndex: 1 })}
          className="sm:max-w-[420px]"
        />

        {(role === 'Veterinarian' || role === 'Admin') && (
          <Select
            value={query.mine ? 'mine' : 'all'}
            onValueChange={(value) => onQueryChange({ ...query, mine: value === 'mine', pageIndex: 1 })}
          >
            <SelectTrigger className="h-9 bg-white" aria-label="Consultas por responsable">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mine">Mis consultas</SelectItem>
              <SelectItem value="all">Todas</SelectItem>
            </SelectContent>
          </Select>
        )}

        <label className="flex sm:ml-auto items-center gap-2 text-[14px] text-[#27374D]">
          <Switch
            checked={query.includeSuspended}
            onCheckedChange={(checked) => onQueryChange({ ...query, includeSuspended: checked, pageIndex: 1 })}
          />
          Mostrar suspendidas
        </label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9 bg-white sm:ml-0">
              Editar columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {COLUMNS.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={!hidden.includes(column.key)}
                onCheckedChange={(checked) =>
                  setHidden(checked ? hidden.filter((key) => key !== column.key) : [...hidden, column.key])
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={TABLE_CARD_CLASSES}>
        <Table className="table-fixed" style={{ minWidth }}>
          <TableHeader>
            <TableRow className={TABLE_HEADER_ROW_CLASSES}>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={TABLE_HEAD_CLASSES}
                  style={column === flexibleColumn ? undefined : { width: column.width }}
                >
                  {column.sortBy ? (
                    <button type="button" onClick={() => handleSort(column.sortBy!)} className="cursor-pointer uppercase hover:text-white">
                      {column.label} {query.sortBy === column.sortBy ? (query.sortDesc ? '↓' : '↑') : ''}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              <TableHead style={{ width: TABLE_ACTION_WIDTH }} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((consultation) => (
              <TableRow
                key={consultation.id}
                onClick={() => navigate(`/consultations/${consultation.id}`)}
                className={`${TABLE_ROW_CLASSES} cursor-pointer ${consultation.isSuspended ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={TABLE_CELL_CLASSES}>
                    {renderCell(consultation, column.key)}
                  </TableCell>
                ))}
                <TableCell className="px-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Acciones" onClick={(event) => event.stopPropagation()}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/consultations/${consultation.id}`)}>
                        Ver detalle
                      </DropdownMenuItem>
                      {consultation.isSuspended ? (
                        <DropdownMenuItem onClick={() => onReactivate(consultation.id)}>Reactivar consulta</DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => navigate(`/consultations/${consultation.id}/edit`)}>
                            Editar consulta
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setConsultationToSuspend(consultation)}>
                            Suspender consulta
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-[#526D82]">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#526D82]">
        <span>
          Página {pagination.pageIndex} de {pagination.totalPages}
        </span>
        <div className="flex items-center gap-2">
          <span>Filas por página</span>
          <Select value={String(query.pageSize)} onValueChange={(value) => onQueryChange({ ...query, pageSize: Number(value), pageIndex: 1 })}>
            <SelectTrigger size="sm" className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => onQueryChange({ ...query, pageIndex: pagination.pageIndex - 1 })} disabled={!pagination.hasPreviousPage}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQueryChange({ ...query, pageIndex: pagination.pageIndex + 1 })} disabled={!pagination.hasNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
      {consultationToSuspend !== null && (
        <ConfirmDialog
          title="Suspender consulta"
          confirmLabel="Suspender"
          description={`¿Confirmás que querés suspender la consulta "${consultationToSuspend.description}"?`}
          onClose={() => setConsultationToSuspend(null)}
          onConfirm={() => onSuspend(consultationToSuspend.id)}
        />
      )}
    </div>
  );
}
