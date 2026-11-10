import { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import type { IPaginatedResponse, PageQuery } from '../../services/IPaginated';
import { errorMessage } from '../../utils/errors';
import { FormField } from '../common/FormField';
import { TABLE_ACTION_WIDTH, TABLE_CARD_CLASSES, TABLE_CELL_CLASSES, TABLE_HEAD_CLASSES, TABLE_HEADER_ROW_CLASSES, TABLE_ROW_CLASSES } from '../common/listStyles';
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/common/SearchInput';
import { Spinner } from '@/components/ui/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CatalogItem {
  id: number;
  name: string;
}

interface CatalogTableProps<T extends CatalogItem> {
  title: string;
  itemLabel: string;
  deleteWarning: string;
  page: IPaginatedResponse<T>;
  isLoading: boolean;
  query: PageQuery;
  onQueryChange: (query: PageQuery) => void;
  selectedId?: number;
  onSelect?: (item: T) => void;
  onSave: (id: number | null, name: string) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
}

export function CatalogTable<T extends CatalogItem>({
  title,
  itemLabel,
  deleteWarning,
  page,
  isLoading,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  onSave,
  onDelete,
}: CatalogTableProps<T>) {
  const [editing, setEditing] = useState<{ id: number | null; name: string } | null>(null);
  const [nameError, setNameError] = useState('');
  const [toDelete, setToDelete] = useState<T | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const sortDirection = query.sortDesc ? '↓' : '↑';

  const openEditor = (id: number | null, name: string) => {
    setEditing({ id, name });
    setNameError('');
  };

  const handleSave = async () => {
    if (!editing) return;
    const name = editing.name.trim();
    if (!name) return setNameError('El nombre es obligatorio.');
    if (name.length > 50) return setNameError('El nombre no puede superar los 50 caracteres.');

    setIsSaving(true);
    try {
      await onSave(editing.id, name);
      setEditing(null);
    } catch (error) {
      setNameError(errorMessage(error, `No se pudo guardar la ${itemLabel}.`));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await onDelete(toDelete);
    } catch (error) {
      toast.error(errorMessage(error, `No se pudo borrar la ${itemLabel}.`));
    }
    setToDelete(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[18px] font-semibold text-[#27374D]">{title}</h2>
        <Button size="sm" className="ml-auto" onClick={() => openEditor(null, '')}>
          <Plus /> Nueva {itemLabel}
        </Button>
      </div>

      <SearchInput
        aria-label={`Buscar en ${title}`}
        placeholder="Buscar por nombre..."
        value={query.search}
        onChange={(event) => onQueryChange({ ...query, search: event.target.value, pageIndex: 1 })}
      />

      <div className={TABLE_CARD_CLASSES}>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className={TABLE_HEADER_ROW_CLASSES}>
              <TableHead className={TABLE_HEAD_CLASSES}>
                <button
                  type="button"
                  onClick={() => onQueryChange({ ...query, sortBy: 'name', sortDesc: query.sortBy === 'name' && !query.sortDesc, pageIndex: 1 })}
                  className="cursor-pointer uppercase hover:text-white"
                >
                  Nombre {query.sortBy === 'name' && sortDirection}
                </button>
              </TableHead>
              <TableHead style={{ width: TABLE_ACTION_WIDTH }} />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-[#526D82]">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner /> Cargando...
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && page.items.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onSelect?.(item)}
                className={`${TABLE_ROW_CLASSES} text-[#27374D] ${onSelect ? 'cursor-pointer' : ''} ${item.id === selectedId ? 'bg-[#DDE6ED] font-semibold' : ''}`}
              >
                <TableCell className={TABLE_CELL_CLASSES}>{item.name}</TableCell>
                <TableCell className="px-5 text-right" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Acciones">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditor(item.id, item.name)}>Renombrar</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onClick={() => setToDelete(item)}>
                        Borrar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && page.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-[#526D82]">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-[13px] text-[#526D82]">
        <span>
          Página {page.pageIndex} de {page.totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onQueryChange({ ...query, pageIndex: page.pageIndex - 1 })} disabled={!page.hasPreviousPage}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => onQueryChange({ ...query, pageIndex: page.pageIndex + 1 })} disabled={!page.hasNextPage}>
            Siguiente
          </Button>
        </div>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && !isSaving && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? `Renombrar ${itemLabel}` : `Nueva ${itemLabel}`}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-4"
          >
            <FormField
              label="Nombre"
              value={editing?.name ?? ''}
              onChange={(name) => {
                setEditing((current) => current && { ...current, name });
                setNameError('');
              }}
              error={nameError}
              maxLength={50}
              disabled={isSaving}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={isSaving}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Borrar {itemLabel}</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Confirmás que querés borrar "{toDelete?.name}"? {deleteWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Borrar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
