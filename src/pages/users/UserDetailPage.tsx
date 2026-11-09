import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Pencil, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ListState } from '../../components/common/ListState';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationHistoryCard } from '../../components/consultations/ConsultationHistoryCard';
import { UserPetsCard } from '../../components/users/UserPetsCard';
import { ROLE_LABELS } from '../../components/users/userTypes';
import { useAuth } from '../../contexts/AuthenticationContext';
import type { IUserResponse, UserRole } from '../../services/users/IUser';
import { handleDeleteUser, handleGetByIdUser, handleReactivateUser, handleUpdateUserRole } from '../../services/users/userService';
import { errorMessage } from '../../utils/errors';
import { initials } from '../../utils/initials';
import { canManage } from '../../utils/roles';

export function UserDetailPage() {
  const { id = '' } = useParams();
  const { role } = useAuth();
  const [result, setResult] = useState<{ id: string; user?: IUserResponse; error?: string } | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<number | null>(null);
  const [userToChangeRole, setUserToChangeRole] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const current = result?.id === id ? result : null;
  const user = current?.user;
  const userRole = user?.roleName as UserRole | null | undefined;
  const canManageUser = Boolean(userRole && canManage(role, userRole));
  const nextRole = userRole === 'Veterinarian' ? 'Admin' : userRole === 'Admin' ? 'Veterinarian' : null;
  const canChangeRole = role === 'SysAdmin' && nextRole !== null;
  const name = user?.fullName?.trim() || 'Sin nombre';

  useEffect(() => {
    let active = true;

    handleGetByIdUser(id)
      .then((user) => { if (active) setResult({ id, user }); })
      .catch((error) => {
        if (active) setResult({ id, error: errorMessage(error, 'No se pudo cargar el usuario.') });
      });

    return () => { active = false; };
  }, [id]);

  const changeSuspension = async (isSuspended: boolean) => {
    if (!user || !canManageUser || isUpdating || user.isSuspended === isSuspended) return;
    setIsUpdating(true);

    try {
      if (isSuspended) await handleDeleteUser(String(user.id));
      else await handleReactivateUser(String(user.id));

      setResult((current) => current?.user?.id === user.id
        ? { ...current, user: { ...current.user, isSuspended } }
        : current);
      toast.success(isSuspended ? 'Usuario suspendido correctamente.' : 'Usuario reactivado correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, isSuspended ? 'No se pudo suspender el usuario.' : 'No se pudo reactivar el usuario.'));
    } finally {
      setIsUpdating(false);
    }
  };

  const changeRole = async () => {
    if (!user || !canChangeRole || !nextRole || isUpdating) return;
    setIsUpdating(true);

    try {
      await handleUpdateUserRole(String(user.id), nextRole);
      setResult((current) => current?.user?.id === user.id
        ? { ...current, user: { ...current.user, roleName: nextRole } }
        : current);
      toast.success('Rol actualizado correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, 'No se pudo cambiar el rol del usuario.'));
    } finally {
      setIsUpdating(false);
    }
  };

  const fields = user ? [
    { label: 'Correo', value: user.email },
    { label: 'Teléfono', value: user.phone },
    ...(userRole === 'Client' ? [{ label: 'DNI', value: user.dni }] : []),
    ...(userRole === 'Veterinarian' || userRole === 'Admin'
      ? [{ label: 'Matrícula', value: user.registrationNumber }]
      : []),
  ] : [];

  return (
    <ScreenShell title="Detalle de usuario" icon={UserRound} backTo="/users" homeTo="/">
      <div className="flex-1 px-4 py-4 lg:px-10 lg:py-8">
        {user ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <Card>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar className="size-16" aria-hidden="true">
                    <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">{initials(name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="wrap-anywhere text-2xl font-semibold sm:text-3xl"><h2>{name}</h2></CardTitle>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-muted-foreground">{userRole ? ROLE_LABELS[userRole] ?? 'Sin registrar' : 'Sin registrar'}</span>
                      <Badge variant={user.isSuspended ? 'outline' : 'secondary'}>
                        {user.isSuspended ? 'Suspendido' : 'Activo'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Separator />
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {fields.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="mt-1 wrap-anywhere text-base font-medium">{value?.trim() || 'Sin registrar'}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
              {canManageUser && (
                <CardFooter className="flex-col-reverse justify-end gap-2 sm:flex-row">
                  {user.isSuspended ? (
                    <Button size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => changeSuspension(false)}>
                      Reactivar usuario
                    </Button>
                  ) : (
                    <Button variant="destructive" size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => setUserToSuspend(user.id)}>
                      Suspender usuario
                    </Button>
                  )}
                  {canChangeRole && nextRole && (
                    <Button variant="outline" size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => setUserToChangeRole(user.id)}>
                      Cambiar a {ROLE_LABELS[nextRole].toLowerCase()}
                    </Button>
                  )}
                  {!user.isSuspended && !isUpdating && (
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <Link to={`/users/${user.id}/edit`}><Pencil aria-hidden="true" />Editar usuario</Link>
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
            {userRole === 'Client' && <UserPetsCard key={user.id} clientId={user.id} />}
            {(userRole === 'Veterinarian' || userRole === 'Admin') && (
              <ConsultationHistoryCard key={user.id} source="veterinarian" id={user.id} />
            )}
            {canManageUser && userToSuspend === user.id && (
              <ConfirmDialog
                title="Suspender usuario"
                description={`¿Confirmás que querés suspender a ${name}? No va a poder iniciar sesión, y sus mascotas y consultas quedan suspendidas. Podés reactivarlo después.`}
                confirmLabel="Suspender"
                onClose={() => setUserToSuspend(null)}
                onConfirm={() => changeSuspension(true)}
              />
            )}
            {canChangeRole && nextRole && userRole && userToChangeRole === user.id && (
              <ConfirmDialog
                title="Cambiar rol"
                description={`¿Confirmás que querés cambiar el rol de ${name} de ${ROLE_LABELS[userRole]} a ${ROLE_LABELS[nextRole]}?`}
                confirmLabel="Cambiar rol"
                onClose={() => setUserToChangeRole(null)}
                onConfirm={changeRole}
              />
            )}
          </div>
        ) : (
          <ListState
            isLoading={current === null}
            error={current?.error ?? ''}
            isEmpty
            loadingLabel="Cargando usuario..."
            emptyLabel="No se encontró el usuario."
          />
        )}
      </div>
    </ScreenShell>
  );
}
