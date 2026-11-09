import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import type { User } from './userTypes';
import type { AssignableRole, UserQuery } from '../../services/users/IUser';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from './userTypes';
import {
  TABLE_CARD_CLASSES,
  TABLE_HEAD_CLASSES,
  TABLE_HEADER_ROW_CLASSES,
  TABLE_ROW_CLASSES,
} from '../common/listStyles';
import { initials } from '../../utils/initials';
import { ConfirmDialog } from '../common/ConfirmDialog';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS, type Pagination } from '../../services/IPaginated';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserTableProps {
  query: UserQuery;
  onQueryChange: (query: UserQuery) => void;
  pagination: Pagination;
  users: User[];
  canManageUser: (user: User) => boolean;
  onSuspend: (user: User) => void;
  onReactivate: (user: User) => void;
}

type ColumnKey = 'fullName' | 'roleName' | 'email' | 'identification' | 'phone';

const ROLE_FILTER_OPTIONS: AssignableRole[] = ['Client', 'Veterinarian', 'Admin'];

export function UserTable({ query, onQueryChange, pagination, users: rows, canManageUser, onSuspend, onReactivate }: UserTableProps) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [hidden, setHidden] = useState<ColumnKey[]>([]);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);

  const showRegistrationNumber = role === 'Admin' || role === 'SysAdmin';
  const availableColumns: { key: ColumnKey; label: string; sortBy?: string }[] = [
    { key: 'fullName', label: 'Nombre', sortBy: 'fullName' },
    { key: 'roleName', label: 'Rol' },
    { key: 'email', label: 'Email', sortBy: 'email' },
    { key: 'identification', label: showRegistrationNumber ? 'DNI / Matrícula' : 'DNI' },
    { key: 'phone', label: 'Teléfono' },
  ];
  const columns = availableColumns.filter((column) => !hidden.includes(column.key));

  const handleSort = (sortBy: string) => {
    onQueryChange({ ...query, sortBy, sortDesc: query.sortBy === sortBy ? !query.sortDesc : false, pageIndex: 1 });
  };

  const renderCell = (user: User, key: ColumnKey) => {
    if (key === 'roleName') return <Badge variant="secondary">{ROLE_LABELS[user.roleName]}</Badge>;
    if (key === 'identification') {
      if (user.roleName === 'Client') return user.dni || '-';
      if (showRegistrationNumber && (user.roleName === 'Admin' || user.roleName === 'Veterinarian')) {
        return user.registrationNumber || '-';
      }
      return '-';
    }
    if (key === 'fullName') {
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className={user.isSuspended ? '' : 'bg-primary text-primary-foreground'}>{initials(user.fullName)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{user.fullName}</span>
          {user.isSuspended && <Badge variant="outline">Suspendido</Badge>}
        </div>
      );
    }
    return user[key] || '-';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nombre o email..."
          value={query.search}
          onChange={(event) => onQueryChange({ ...query, search: event.target.value, pageIndex: 1 })}
          className="h-9 bg-white sm:max-w-[420px]"
        />

        {role !== 'Veterinarian' && (
        <Select
          value={query.role || 'all'}
          onValueChange={(value) => onQueryChange({ ...query, role: value === 'all' ? '' : value, pageIndex: 1 })}
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {ROLE_FILTER_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        )}

        <Select
          value={query.isSuspend ? 'suspended' : query.includeSuspended ? 'all' : 'active'}
          onValueChange={(value) =>
            onQueryChange({
              ...query,
              includeSuspended: value === 'all',
              isSuspend: value === 'suspended' ? true : undefined,
              pageIndex: 1,
            })
          }
        >
          <SelectTrigger className="h-9 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Solo activos</SelectItem>
            <SelectItem value="suspended">Solo suspendidos</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto h-9 bg-white">
              Editar columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableColumns.map((column) => (
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
            {rows.map((user) => {
              const canOpenDetail = canManageUser(user);
              const detailTo = `/users/${user.id}`;

              return (
                <TableRow
                  key={user.id}
                  onClick={canOpenDetail ? () => navigate(detailTo) : undefined}
                  className={`${TABLE_ROW_CLASSES} ${canOpenDetail ? 'cursor-pointer' : ''} ${user.isSuspended ? 'bg-[#DDE6ED]/30 text-[#526D82]' : 'text-[#27374D]'}`}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-5 py-4">
                      {renderCell(user, column.key)}
                    </TableCell>
                  ))}
                  <TableCell className="px-5 text-right">
                    {canOpenDetail && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label="Acciones" onClick={(event) => event.stopPropagation()}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(detailTo)}>Ver detalle</DropdownMenuItem>
                          {user.isSuspended ? (
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
              );
            })}
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

      {userToSuspend && (
        <ConfirmDialog
          title="Suspender usuario"
          confirmLabel="Suspender"
          description={`¿Confirmás que querés suspender a ${userToSuspend.fullName}? No va a poder iniciar sesión, y sus mascotas y consultas quedan suspendidas. Podés reactivarlo después.`}
          onClose={() => setUserToSuspend(null)}
          onConfirm={() => onSuspend(userToSuspend)}
        />
      )}
    </div>
  );
}
