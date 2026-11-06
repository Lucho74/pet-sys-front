import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Consultation } from './consultationTypes';
import { formatDate } from '../../utils/datetime';
import {
  TABLE_CARD_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_HEADER_ROW_CLASSES,
  TABLE_ROW_CLASSES,
} from '../common/listStyles';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS, type PageQuery, type Pagination } from '../../services/IPaginated';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ConsultationTableProps {
  query: PageQuery;
  onQueryChange: (query: PageQuery) => void;
  pagination: Pagination;
  consultations: Consultation[];
}

type ColumnKey = 'id' | 'description' | 'date' | 'petName' | 'veterinarianName';

const COLUMNS: { key: ColumnKey; label: string; sortBy?: string }[] = [
  { key: 'id', label: 'N°' },
  { key: 'description', label: 'Descripción' },
  { key: 'date', label: 'Fecha', sortBy: 'date' },
  { key: 'petName', label: 'Mascota' },
  { key: 'veterinarianName', label: 'Veterinario' },
];

export function ConsultationTable({ query, onQueryChange, pagination, consultations: rows }: ConsultationTableProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState<ColumnKey[]>([]);

  const columns = COLUMNS.filter((column) => !hidden.includes(column.key));

  const handleSort = (sortBy: string) => {
    onQueryChange({ ...query, sortBy, sortDesc: query.sortBy === sortBy ? !query.sortDesc : false, pageIndex: 1 });
  };

  const renderCell = (consultation: Consultation, key: ColumnKey) => {
    if (key === 'date') return consultation.date ? formatDate(consultation.date) : 'Sin fecha';
    if (key === 'id') return <Avatar>
            <AvatarFallback className={consultation.isDeleted ? '' : 'bg-primary text-primary-foreground'}>{consultation.id}</AvatarFallback>
          </Avatar>;
    if (key === 'petName') return <Badge variant="secondary">{consultation.petName}</Badge>;
    if (key === 'description') {
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{consultation.description}</span>
          {consultation.isDeleted && <Badge variant="outline">Suspendido</Badge>}
        </div>
      );
    }
    return consultation[key];
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por descripción..."
          value={query.search}
          onChange={(event) => onQueryChange({ ...query, search: event.target.value, pageIndex: 1 })}
          className="h-9 bg-white sm:max-w-[420px]"
        />

        <label className="flex sm:ml-auto items-center gap-2 text-[14px] text-[#27374D]">
          <Switch
            checked={query.includeDeleted}
            onCheckedChange={(checked) => onQueryChange({ ...query, includeDeleted: checked, pageIndex: 1 })}
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
        <Table>
          <TableHeader>
            <TableRow className={TABLE_HEADER_ROW_CLASSES}>
              {columns.map((column) => (
                <TableHead key={column.key} className={TABLE_HEAD_CLASSES}>
                  {column.sortBy ? (
                    <button type="button" onClick={() => handleSort(column.sortBy!)} className="cursor-pointer uppercase hover:text-white">
                      {column.label} {query.sortBy === column.sortBy ? (query.sortDesc ? '↓' : '↑') : ''}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((consultation) => (
              <TableRow
                key={consultation.id}
                className={`${TABLE_ROW_CLASSES} ${consultation.isDeleted ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-4 py-3">
                    {renderCell(consultation, column.key)}
                  </TableCell>
                ))}
                <TableCell className="px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      {!consultation.isDeleted && (
                        <DropdownMenuItem onClick={() => navigate(`/consultations/${consultation.id}/edit`)}>
                          Editar consulta
                        </DropdownMenuItem>
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
    </div>
  );
}
