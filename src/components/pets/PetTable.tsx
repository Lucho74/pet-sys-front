import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { Pet } from './petTypes';
import type { PetQuery } from '../../services/pets/IPet';
import type { IBreed, ISpecies } from '../../services/species/ISpecies';
import { formatDate } from '../../utils/datetime';
import { ConfirmDialog } from '../common/ConfirmDialog';
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
  onSuspend: (id: number) => Promise<void>;
  onReactivate: (id: number) => Promise<void>;
  pagination: Pagination;
  pets: Pet[];
  species: ISpecies[];
  breeds: IBreed[];
}

type ColumnKey = 'name' | 'species' | 'breed' | 'birthDate';

const COLUMNS: { key: ColumnKey; label: string; sortBy?: string }[] = [
  { key: 'name', label: 'Nombre', sortBy: 'name' },
  { key: 'species', label: 'Especie', sortBy: 'species' },
  { key: 'breed', label: 'Raza', sortBy: 'breed' },
  { key: 'birthDate', label: 'Nacimiento' },
];

export function PetTable({ query, onQueryChange, onSuspend, onReactivate, pagination, pets: rows, species, breeds }: PetTableProps) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [petToSuspend, setPetToSuspend] = useState<Pet | null>(null);

  const columns = COLUMNS.filter((column) => !hidden.includes(column.key));

  const handleSort = (sortBy: string) => {
    onQueryChange({ ...query, sortBy, sortDesc: query.sortBy === sortBy ? !query.sortDesc : false, pageIndex: 1 });
  };

  const renderCell = (pet: Pet, key: ColumnKey) => {
    if (key === 'birthDate') return pet.birthDate ? formatDate(pet.birthDate) : 'Sin fecha';
    if (key === 'species') return <Badge variant="secondary">{pet.species}</Badge>;
    if (key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={pet.isSuspended ? '' : 'bg-primary text-primary-foreground'}>{initials(pet.name)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{pet.name}</span>
          {pet.isSuspended && <Badge variant="outline">Suspendido</Badge>}
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
          value={query.speciesId ? String(query.speciesId) : 'all'}
          onValueChange={(value) =>
            onQueryChange({ ...query, speciesId: value === 'all' ? undefined : Number(value), breedId: undefined, pageIndex: 1 })
          }
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las especies</SelectItem>
            {species.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          disabled={!query.speciesId}
          value={query.breedId ? String(query.breedId) : 'all'}
          onValueChange={(value) => onQueryChange({ ...query, breedId: value === 'all' ? undefined : Number(value), pageIndex: 1 })}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las razas</SelectItem>
            {breeds.map((item) => (
              <SelectItem key={item.id} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-[14px] text-[#27374D] sm:ml-auto">
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
              <TableRow
                key={pet.id}
                onClick={() => navigate(`/pets/${pet.id}`)}
                className={`${TABLE_ROW_CLASSES} cursor-pointer ${pet.isSuspended ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-4 py-3">
                    {renderCell(pet, column.key)}
                  </TableCell>
                ))}
                <TableCell className="px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Acciones" onClick={(event) => event.stopPropagation()}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/pets/${pet.id}`)}>Ver detalle</DropdownMenuItem>
                      {pet.isSuspended ? (
                        <DropdownMenuItem onClick={() => onReactivate(pet.id)}>Reactivar mascota</DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => navigate(`/pets/${pet.id}/edit`)}>Editar mascota</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setPetToSuspend(pet)}>
                            Suspender mascota
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
      {petToSuspend && (
        <ConfirmDialog
          title="Suspender mascota"
          confirmLabel="Suspender"
          description={`¿Confirmás que querés suspender la mascota ${petToSuspend.name}?`}
          onClose={() => setPetToSuspend(null)}
          onConfirm={() => onSuspend(petToSuspend.id)}
        />
      )}
    </div>
  );
}
