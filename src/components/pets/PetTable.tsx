import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { Pet } from './petTypes';
import { formatDate } from '../../utils/datetime';
import { matchesSearch } from '../../utils/search';
import {
  AVATAR_CLASSES,
  avatarColors,
  DELETED_BADGE_CLASSES,
  PILL_CLASSES,
  TABLE_CARD_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_HEADER_ROW_CLASSES,
  TABLE_ROW_CLASSES,
} from '../common/listStyles';
import { initials } from '../../utils/initials';
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
  pagination: Pagination;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pets: Pet[];
}

type ColumnKey = 'name' | 'specie' | 'breed' | 'birthDate';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'specie', label: 'Especie' },
  { key: 'breed', label: 'Raza' },
  { key: 'birthDate', label: 'Nacimiento' },
];

export function PetTable({ pagination, onPageChange, pageSize, onPageSizeChange, pets }: PetTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<ColumnKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [showDeleted, setShowDeleted] = useState(true);
  const [specieFilter, setSpecieFilter] = useState('all');
  const [breedFilter, setBreedFilter] = useState('all');

  // Las opciones salen de las mascotas cargadas; las razas, solo de la especie elegida.
  const species = [...new Set(pets.map((p) => p.specie).filter(Boolean))].sort();
  const breeds = [
    ...new Set(pets.filter((p) => specieFilter === 'all' || p.specie === specieFilter).map((p) => p.breed).filter(Boolean)),
  ].sort();

  const filtered = pets.filter(
    (p) =>
      (showDeleted || !p.isDeleted) &&
      (specieFilter === 'all' || p.specie === specieFilter) &&
      (breedFilter === 'all' || p.breed === breedFilter) &&
      (matchesSearch(p.name, search) || matchesSearch(p.specie, search) || matchesSearch(p.breed, search)),
  );

  const sorted = sortKey
    ? filtered.toSorted((a, b) => {
        const result = String(a[sortKey]).localeCompare(String(b[sortKey]), 'es', { numeric: true });
        return sortAsc ? result : -result;
      })
    : filtered;

  const columns = COLUMNS.filter((column) => !hidden.includes(column.key));

  const handleSort = (key: ColumnKey) => {
    setSortAsc(sortKey === key ? !sortAsc : true);
    setSortKey(key);
  };

  const renderCell = (pet: Pet, key: ColumnKey) => {
    if (key === 'birthDate') return pet.birthDate ? formatDate(pet.birthDate) : 'Sin fecha';
    if (key === 'specie') return <span className={PILL_CLASSES}>{pet.specie}</span>;
    if (key === 'name') {
      return (
        <div className="flex items-center gap-3">
          <span className={`${AVATAR_CLASSES} ${avatarColors(pet.isDeleted)}`}>{initials(pet.name)}</span>
          <span className="font-semibold">{pet.name}</span>
          {pet.isDeleted && <span className={DELETED_BADGE_CLASSES}>Suspendido</span>}
        </div>
      );
    }
    return pet[key];
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar mascotas..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="h-9 bg-white sm:max-w-[420px]"
        />

        <Select
          value={specieFilter}
          onValueChange={(value) => {
            setSpecieFilter(value);
            setBreedFilter('all');
          }}
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
          value={breedFilter}
          onValueChange={(value) => {
            setBreedFilter(value);
          }}
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
            checked={showDeleted}
            onCheckedChange={(checked) => {
              setShowDeleted(checked);
            }}
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
                  <button type="button" onClick={() => handleSort(column.key)} className="cursor-pointer uppercase hover:text-white">
                    {column.label} {sortKey === column.key ? (sortAsc ? '↑' : '↓') : ''}
                  </button>
                </TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {sorted.map((pet) => (
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
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#526D82]">
        <span>
          Página {pagination.pageIndex} de {pagination.totalPages}
        </span>
        <div className="flex items-center gap-2">
          <span>Filas por página</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
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
          <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.pageIndex - 1)} disabled={!pagination.hasPreviousPage}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.pageIndex + 1)} disabled={!pagination.hasNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
