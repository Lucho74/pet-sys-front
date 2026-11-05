import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { User } from './userTypes';
import { ROLE_LABELS } from './userTypes';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

interface UserTableProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  users: User[];
  canManageUser: (user: User) => boolean;
  onSuspend: (user: User) => void;
  onReactivate: (user: User) => void;
}

type ColumnKey = 'fullName' | 'roleName' | 'email' | 'dni' | 'phone';

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'fullName', label: 'Nombre' },
  { key: 'roleName', label: 'Rol' },
  { key: 'email', label: 'Email' },
  { key: 'dni', label: 'DNI' },
  { key: 'phone', label: 'Teléfono' },
];

export function UserTable({ pagination, onPageChange, pageSize, onPageSizeChange, users, canManageUser, onSuspend, onReactivate }: UserTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<ColumnKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [showDeleted, setShowDeleted] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      (showDeleted || !u.isDeleted) &&
      (roleFilter === 'all' || u.roleName === roleFilter) &&
      (matchesSearch(u.fullName, search) || matchesSearch(u.email, search) || matchesSearch(u.dni, search)),
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

  const renderCell = (user: User, key: ColumnKey) => {
    if (key === 'roleName') return <span className={PILL_CLASSES}>{ROLE_LABELS[user.roleName]}</span>;
    if (key === 'fullName') {
      return (
        <div className="flex items-center gap-3">
          <span className={`${AVATAR_CLASSES} ${avatarColors(user.isDeleted)}`}>{initials(user.fullName)}</span>
          <span className="font-semibold">{user.fullName}</span>
          {user.isDeleted && <span className={DELETED_BADGE_CLASSES}>Suspendido</span>}
        </div>
      );
    }
    return user[key] || '-';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar usuarios..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
          }}
          className="h-9 bg-white sm:max-w-[420px]"
        />

        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value);
          }}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <SelectItem key={role} value={role}>
                {label}
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
          Mostrar suspendidos
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
            {sorted.map((user) => (
              <TableRow key={user.id} className={`${TABLE_ROW_CLASSES} ${user.isDeleted ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}>
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-4 py-3">
                    {renderCell(user, column.key)}
                  </TableCell>
                ))}
                <TableCell className="px-4 text-right">
                  {/* El back responde 403 si el rol no puede gestionar a ese usuario (incluido uno mismo). */}
                  {canManageUser(user) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        {user.isDeleted ? (
                          <DropdownMenuItem onClick={() => onReactivate(user)}>Reactivar usuario</DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
                              Editar usuario
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => setUserToSuspend(user)}>
                              Suspender usuario
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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

      <AlertDialog open={userToSuspend !== null} onOpenChange={(open) => !open && setUserToSuspend(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspender usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Confirmás que querés suspender a {userToSuspend?.fullName}? No va a poder iniciar sesión, y sus mascotas y
              consultas quedan suspendidas. Podés reactivarlo después.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => userToSuspend && onSuspend(userToSuspend)}>Suspender</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
