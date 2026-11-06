import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { Pet } from './petTypes';
import type { PetQuery } from '../../services/pets/IPet';
import { formatDate } from '../../utils/datetime';
import {
  TABLE_CARD_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_HEADER_ROW_CLASSES,
  TABLE_ROW_CLASSES,
} from '../common/listStyles';
import { initials } from '../../utils/initials';
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS, type Pagination } from '../../services/IPaginated';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PetTableProps {
  query: PetQuery;
  onQueryChange: (query: PetQuery) => void;
  pagination: Pagination;
  pets: Pet[];
  species: string[];
  breeds: string[];
}

type ColumnKey = 'name' | 'specie' | 'breed' | 'birthDate';

const COLUMNS: { key: ColumnKey; label: string; sortBy?: string }[] = [
  { key: 'name', label: 'Nombre', sortBy: 'name' },
  { key: 'specie', label: 'Especie', sortBy: 'specie' },
  { key: 'breed', label: 'Raza', sortBy: 'breed' },
  { key: 'birthDate', label: 'Nacimiento' },
];

export function PetTable({ query, onQueryChange, pagination, pets: rows, species, breeds }: PetTableProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState<ColumnKey[]>([]);

  const columns = COLUMNS.filter((column) => !hidden.includes(column.key));

  const handleSort = (sortBy: string) => {
    onQueryChange({ ...query, sortBy, sortDesc: query.sortBy === sortBy ? !query.sortDesc : false, pageIndex: 1 });
  };

  const renderCell = (pet: Pet, key: ColumnKey) => {
    if (key === 'birthDate') return pet.birthDate ? formatDate(pet.birthDate) : 'Sin fecha';
    if (key === 'specie') return <Badge variant="secondary">{pet.specie}</Badge>;
    if (key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={pet.isDeleted ? '' : 'bg-primary text-primary-foreground'}>{initials(pet.name)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{pet.name}</span>
          {pet.isDeleted && <Badge variant="outline">Suspendido</Badge>}
        </div>
      );
    }
    return pet[key];
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nombre..."
          value={query.search}
          onChange={(event) => onQueryChange({ ...query, search: event.target.value, pageIndex: 1 })}
          className="h-9 bg-white sm:max-w-[420px]"
        />

        <Select
          value={query.specie || 'all'}
          onValueChange={(value) => onQueryChange({ ...query, specie: value === 'all' ? '' : value, breed: '', pageIndex: 1 })}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las especies</SelectItem>
            {species.map((specie) => (
              <SelectItem key={specie} value={specie}>
                {specie}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          disabled={!query.specie}
          value={query.breed || 'all'}
          onValueChange={(value) => onQueryChange({ ...query, breed: value === 'all' ? '' : value, pageIndex: 1 })}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las razas</SelectItem>
            {breeds.map((breed) => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-[14px] text-[#27374D] sm:ml-auto">
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
            {rows.map((pet) => (
              <TableRow key={pet.id} className={`${TABLE_ROW_CLASSES} ${pet.isDeleted ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-4 py-3">
                    {renderCell(pet, column.key)}
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
                      {!pet.isDeleted && (
                        <DropdownMenuItem onClick={() => navigate(`/pets/${pet.id}/edit`)}>Editar mascota</DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => navigate(`/pets/${pet.id}/consultations`)}>
                        Ver consultas
                      </DropdownMenuItem>
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
