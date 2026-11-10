import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ListState } from '../../components/common/ListState';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ROLE_LABELS } from '../../components/users/userTypes';
import { useAuth } from '../../contexts/AuthenticationContext';
import { handleGetCurrentUser } from '../../services/auth/authService';
import type { IUserResponse, UserRole } from '../../services/users/IUser';
import { errorMessage } from '../../utils/errors';
import { initials } from '../../utils/initials';
import { canEditOwnProfile } from '../../utils/roles';

export function ProfilePage() {
  const { role } = useAuth();
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    handleGetCurrentUser()
      .then((user) => { if (active) setUser(user); })
      .catch((error) => {
        if (active) setError(errorMessage(error, 'No se pudieron cargar tus datos.'));
      });

    return () => { active = false; };
  }, []);

  const userRole = user?.roleName as UserRole | null | undefined;
  const name = user?.fullName?.trim() || 'Sin nombre';

  const fields = user ? [
    { label: 'Correo', value: user.email },
    { label: 'Teléfono', value: user.phone },
    ...(userRole === 'Client' ? [{ label: 'DNI', value: user.dni }] : []),
    ...(userRole === 'Veterinarian' || userRole === 'Admin'
      ? [{ label: 'Matrícula', value: user.registrationNumber }]
      : []),
  ] : [];

  return (
    <ScreenShell title="Mis datos" icon={UserRound} backTo="/" homeTo="/">
      <div className="flex-1 px-4 py-4 lg:px-10 lg:py-8">
        {user ? (
          <Card className="mx-auto w-full max-w-3xl">
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="size-16" aria-hidden="true">
                  <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">{initials(name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="wrap-anywhere text-2xl font-semibold sm:text-3xl"><h2>{name}</h2></CardTitle>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {userRole ? ROLE_LABELS[userRole] ?? 'Sin registrar' : 'Sin registrar'}
                  </span>
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
            {canEditOwnProfile(role) && (
              <CardFooter className="justify-end">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/profile/edit" state={{ fromProfile: true }}><Pencil aria-hidden="true" />Editar mis datos</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ) : (
          <ListState
            isLoading={!error}
            error={error}
            isEmpty
            loadingLabel="Cargando tus datos..."
            emptyLabel="No se encontraron tus datos."
          />
        )}
      </div>
    </ScreenShell>
  );
}
