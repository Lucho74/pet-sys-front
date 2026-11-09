import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PawPrint, Pencil, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CREATE_BUTTON_CLASSES } from '../../components/common/listStyles';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { ListState } from '../../components/common/ListState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationHistoryCard } from '../../components/consultations/ConsultationHistoryCard';
import { PetOwnerCard } from '../../components/pets/PetOwnerCard';
import { toPet, type Pet } from '../../components/pets/petTypes';
import { ApiError } from '../../services/apiClient';
import { handleGetByIdPet, handleGetPetImageUrl, handleReactivatePet, handleSuspendPet } from '../../services/pets/petService';
import { formatDate, hasDateTime, todayDate } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';
import { initials } from '../../utils/initials';
import { NotFound } from '../NotFound';

type PetListPath = '/pets' | '/my-pets';

function formatPetAge(birthDate: string): string {
  const today = todayDate();
  if (!hasDateTime(birthDate) || birthDate > today) return 'Sin registrar';

  const currentYear = today.slice(0, 4);
  const birthdayThisYear = `${currentYear}${birthDate.slice(4)}`;
  const years = Number(currentYear) - Number(birthDate.slice(0, 4));
  const age = today < birthdayThisYear ? years - 1 : years;

  if (age === 0) return 'Menos de 1 año';
  return age === 1 ? '1 año' : `${age} años`;
}

export function PetDetailPage({ backTo }: { backTo: PetListPath }) {
  const { id } = useParams();

  return id ? <PetDetail key={id} id={id} backTo={backTo} /> : <NotFound />;
}

function PetDetail({ id, backTo }: { id: string; backTo: PetListPath }) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const petId = pet?.id;

  useEffect(() => {
    let active = true;

    handleGetByIdPet(id)
      .then((response) => {
        if (active) setPet(toPet(response));
      })
      .catch((error) => {
        if (!active) return;

        const message = errorMessage(error, 'No se pudo cargar la mascota.');
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (petId === undefined) return;

    const controller = new AbortController();
    const { signal } = controller;

    handleGetPetImageUrl(String(petId), signal)
      .then((url) => {
        if (!signal.aborted) setImageUrl(url);
      })
      .catch((error: unknown) => {
        if (signal.aborted) return;
        setIsImageLoading(false);
        if (error instanceof ApiError && error.status === 404) return;

        setImageError(true);
      });

    return () => controller.abort();
  }, [petId]);

  const changeSuspension = async (id: number, isSuspended: boolean) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      if (isSuspended) await handleSuspendPet(id);
      else await handleReactivatePet(id);

      setPet((current) => current?.id === id ? { ...current, isSuspended } : current);
      toast.success(isSuspended ? 'Mascota suspendida correctamente.' : 'Mascota reactivada correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, isSuspended ? 'No se pudo suspender la mascota.' : 'No se pudo reactivar la mascota.'));
    } finally {
      setIsUpdating(false);
    }
  };

  const fields = pet ? [
    { label: 'Especie', value: pet.species || 'Sin registrar' },
    { label: 'Fecha de nacimiento', value: pet.birthDate ? formatDate(pet.birthDate) : 'Sin registrar' },
    { label: 'Raza', value: pet.breed || 'Sin registrar' },
    { label: 'Edad', value: formatPetAge(pet.birthDate) },
  ] : [];

  return (
    <ScreenShell title="Detalle de mascota" icon={PawPrint} backTo={backTo} homeTo="/">
      <div className="flex-1 px-4 py-4 lg:px-10 lg:py-8">
        {pet ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <Card>
              <CardContent className="grid items-start gap-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <div className="mx-auto w-full max-w-40 sm:max-w-none">
                  <Avatar className="aspect-square h-auto w-full overflow-hidden rounded-xl bg-muted after:rounded-xl">
                    {imageUrl && (
                      <AvatarImage
                        className="rounded-none object-contain"
                        src={imageUrl}
                        alt={`Foto de ${pet.name}`}
                        onLoadingStatusChange={(status) => {
                          if (status === 'loading') return;
                          setIsImageLoading(false);
                          if (status === 'error') setImageError(true);
                        }}
                      />
                    )}
                    {isImageLoading ? (
                      <AvatarFallback className="rounded-none bg-muted">
                        <Spinner className="size-8 text-muted-foreground" aria-label="Cargando foto" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback aria-hidden="true" className="rounded-none bg-primary text-4xl font-semibold text-primary-foreground">
                        {initials(pet.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {imageError && <p className="mt-2 text-center text-sm text-muted-foreground">No se pudo cargar la foto.</p>}
                </div>
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:justify-start">
                    <CardTitle className="wrap-anywhere text-2xl font-semibold sm:text-3xl">
                      <h2>{pet.name}</h2>
                    </CardTitle>
                    <Badge variant={pet.isSuspended ? 'outline' : 'secondary'}>
                      {pet.isSuspended ? 'Suspendida' : 'Activa'}
                    </Badge>
                  </div>
                  <Separator />
                  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                    {fields.map(({ label, value }) => (
                      <div key={label}>
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="mt-1 wrap-anywhere text-base font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </CardContent>
              {backTo === '/pets' && (
                <CardFooter className="flex-col-reverse justify-end gap-2 sm:flex-row">
                  {pet.isSuspended ? (
                    <Button size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => changeSuspension(pet.id, false)}>
                      Reactivar mascota
                    </Button>
                  ) : (
                    <>
                      <Button variant="destructive" size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => setShowSuspendDialog(true)}>
                        Suspender mascota
                      </Button>
                      <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link to={`/pets/${pet.id}/edit`} state={{ fromPetDetail: true }}>
                          <Pencil aria-hidden="true" />
                          Editar mascota
                        </Link>
                      </Button>
                    </>
                  )}
                </CardFooter>
              )}
            </Card>
            {showSuspendDialog && (
              <ConfirmDialog
                title="Suspender mascota"
                confirmLabel="Suspender"
                description={`¿Confirmás que querés suspender la mascota ${pet.name}?`}
                onClose={() => setShowSuspendDialog(false)}
                onConfirm={() => changeSuspension(pet.id, true)}
              />
            )}
            {backTo === '/pets' && <PetOwnerCard key={pet.clientId} clientId={pet.clientId} />}
            <ConsultationHistoryCard
              source="pet"
              id={pet.id}
              detailBase={backTo === '/my-pets' ? `/my-pets/${pet.id}/consultations` : '/consultations'}
              action={backTo === '/pets' && !pet.isSuspended && (
                <Button asChild size="lg" className={CREATE_BUTTON_CLASSES}>
                  <Link to={`/consultations/new?petId=${pet.id}`}>
                    <Plus aria-hidden="true" /> Nueva consulta
                  </Link>
                </Button>
              )}
            />
          </div>
        ) : (
          <ListState
            isLoading={isLoading}
            error={error}
            isEmpty={false}
            loadingLabel="Cargando mascota..."
            emptyLabel="No se encontró la mascota."
          />
        )}
      </div>
    </ScreenShell>
  );
}
