import { Fragment, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowUpRight, PawPrint, Plus, Stethoscope, UserPlus } from 'lucide-react';
import { ScreenShell } from '../components/layout/ScreenShell';
import { ListState } from '../components/common/ListState';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { useAuth } from '../contexts/AuthenticationContext';
import { handleGetDashboard } from '../services/dashboard/dashboardService';
import type { IDashboardResponse } from '../services/dashboard/IDashboard';
import { CLIENT_ROLES, CLINICAL_ROLES } from '../utils/roles';
import { initials } from '../utils/initials';
import { formatDate } from '../utils/datetime';

const ACTIONS = [
  { to: '/consultations/new', label: 'Crear consulta', description: 'Registrá una nueva consulta para una mascota', icon: Stethoscope },
  { to: '/pets/new', label: 'Crear mascota', description: 'Dá de alta una mascota y asignale un dueño', icon: PawPrint },
  { to: '/users/new', label: 'Crear usuario', description: 'Sumá un cliente, veterinario o administrador', icon: UserPlus },
];

export function Home() {
  const { role } = useAuth();
  const canManage = role !== null && CLINICAL_ROLES.includes(role);
  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const [dashboard, setDashboard] = useState<IDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!canManage) return;

    handleGetDashboard()
      .then(setDashboard)
      .catch(() => setError('No se pudo cargar el panel.'))
      .finally(() => setIsLoading(false));
  }, [canManage]);

  if (role !== null && CLIENT_ROLES.includes(role)) return <Navigate to="/my-pets" replace />;

  const firstName = dashboard?.user.fullName.split(' ')[0];
  const consultations = dashboard?.recentConsultations ?? [];
  const pets = dashboard?.recentPets ?? [];

  return (
    <ScreenShell title={firstName ? `Hola, ${firstName}` : 'Hola'} description={today}>
      <div className="flex-1 overflow-auto px-4 pb-6 pt-5 lg:px-10 lg:pb-12 lg:pt-8">
        {canManage && (
          <div className="flex w-full flex-col gap-6">
            <ul className="grid gap-3 sm:grid-cols-3 lg:gap-4">
              {ACTIONS.map(({ to, label, description, icon: Icon }) => (
                <li key={to}>
                  <Item
                    asChild
                    variant="outline"
                    className="h-full flex-nowrap gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-card! hover:shadow-md"
                  >
                    <Link to={to} state={{ fromHome: true }}>
                      <ItemMedia className="size-11 rounded-lg bg-primary text-primary-foreground">
                        <Icon className="size-5" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="text-base">{label}</ItemTitle>
                        <ItemDescription className="line-clamp-2">{description}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-primary transition-colors group-hover/item:bg-primary group-hover/item:text-primary-foreground">
                          <Plus className="size-4" />
                        </span>
                      </ItemActions>
                    </Link>
                  </Item>
                </li>
              ))}
            </ul>

            <div className="grid gap-4 lg:gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Consultas recientes</CardTitle>
                  <CardDescription>Últimas consultas por fecha</CardDescription>
                  <CardAction>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/consultations">
                        Ver todas
                        <ArrowUpRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <ListState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={consultations.length === 0}
                    loadingLabel="Cargando consultas..."
                    emptyLabel="Todavía no hay consultas."
                  />
                  {!isLoading && !error && (
                    <ItemGroup>
                      {consultations.map((consultation, index) => (
                        <Fragment key={consultation.id}>
                          {index > 0 && <ItemSeparator />}
                          <Item asChild size="sm">
                            <Link to={`/consultations/${consultation.id}`}>
                              <ItemMedia>
                                <Avatar>
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Stethoscope className="size-4" />
                                  </AvatarFallback>
                                </Avatar>
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle className="line-clamp-1">{consultation.description || 'Sin descripción'}</ItemTitle>
                                <ItemDescription className="line-clamp-1">
                                  {consultation.petName} · {consultation.veterinarianName}
                                </ItemDescription>
                              </ItemContent>
                              <ItemActions className="flex-col items-end gap-1">
                                <span className="text-xs tabular-nums text-muted-foreground">{formatDate(consultation.date)}</span>
                                {consultation.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                              </ItemActions>
                            </Link>
                          </Item>
                        </Fragment>
                      ))}
                    </ItemGroup>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mascotas recientes</CardTitle>
                  <CardDescription>Últimas mascotas dadas de alta</CardDescription>
                  <CardAction>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/pets">
                        Ver todas
                        <ArrowUpRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <ListState
                    isLoading={isLoading}
                    error={error}
                    isEmpty={pets.length === 0}
                    loadingLabel="Cargando mascotas..."
                    emptyLabel="Todavía no hay mascotas."
                  />
                  {!isLoading && !error && (
                    <ItemGroup>
                      {pets.map((pet, index) => (
                        <Fragment key={pet.id}>
                          {index > 0 && <ItemSeparator />}
                          <Item asChild size="sm">
                            <Link to={`/pets/${pet.id}`}>
                              <ItemMedia>
                                <Avatar>
                                  <AvatarFallback>{initials(pet.name)}</AvatarFallback>
                                </Avatar>
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle>
                                  {pet.name}
                                  <Badge variant="secondary">{pet.speciesName}</Badge>
                                </ItemTitle>
                                <ItemDescription className="line-clamp-1">
                                  {pet.breedName} · {pet.clientName}
                                </ItemDescription>
                              </ItemContent>
                              {pet.isSuspended && (
                                <ItemActions>
                                  <Badge variant="outline">Suspendida</Badge>
                                </ItemActions>
                              )}
                            </Link>
                          </Item>
                        </Fragment>
                      ))}
                    </ItemGroup>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}
