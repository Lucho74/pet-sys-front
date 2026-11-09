import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Pencil, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ListState } from '../../components/common/ListState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationAttachmentsCard } from '../../components/consultations/ConsultationAttachmentsCard';
import { useAuth } from '../../contexts/AuthenticationContext';
import type { IConsultationWithParticipantsResponse } from '../../services/consultation/IConsultation';
import { handleGetByIdConsultation, handleReactivateConsultation, handleSuspendConsultation } from '../../services/consultation/consultationService';
import { formatDate, hasDateTime } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';
import { canManage, CLINICAL_ROLES } from '../../utils/roles';

export function ConsultationDetailPage() {
  const { id = '', petId } = useParams();
  const { role } = useAuth();
  const canManageConsultation = role !== null && CLINICAL_ROLES.includes(role);
  const petBase = petId ? '/my-pets' : '/pets';
  const [result, setResult] = useState<{
    id: string;
    consultation?: IConsultationWithParticipantsResponse;
    error?: string;
  } | null>(null);
  const [consultationToSuspend, setConsultationToSuspend] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const current = result?.id === id ? result : null;
  const consultation = !petId || String(current?.consultation?.petId) === petId ? current?.consultation : undefined;

  useEffect(() => {
    let active = true;

    handleGetByIdConsultation(id)
      .then((consultation) => {
        if (active) setResult({ id, consultation });
      })
      .catch((error) => {
        if (active) setResult({ id, error: errorMessage(error, 'No se pudo cargar la consulta.') });
      });

    return () => {
      active = false;
    };
  }, [id]);

  const changeSuspension = async (consultationId: number, isSuspended: boolean) => {
    if (!canManageConsultation || isUpdating) return;
    setIsUpdating(true);

    try {
      if (isSuspended) await handleSuspendConsultation(consultationId);
      else await handleReactivateConsultation(consultationId);

      setResult((current) => current?.consultation?.id === consultationId
        ? { ...current, consultation: { ...current.consultation, isSuspended } }
        : current);
      toast.success(isSuspended ? 'Consulta suspendida correctamente.' : 'Consulta reactivada correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, isSuspended ? 'No se pudo suspender la consulta.' : 'No se pudo reactivar la consulta.'));
    } finally {
      setIsUpdating(false);
    }
  };

  const fields = consultation ? [
    { label: 'Fecha', value: hasDateTime(consultation.date) ? formatDate(consultation.date) : 'Sin fecha' },
    {
      label: 'Mascota',
      value: consultation.petName?.trim() || 'Sin registrar',
      to: consultation.petId ? `${petBase}/${consultation.petId}` : undefined,
    },
    {
      label: 'Veterinario',
      value: consultation.veterinarianName?.trim() || 'Sin registrar',
      to: consultation.veterinarianId && canManage(role, 'Veterinarian') ? `/users/${consultation.veterinarianId}` : undefined,
    },
  ] : [];

  return (
    <ScreenShell title="Detalle de consulta" icon={Stethoscope} backTo={petId ? `/my-pets/${petId}` : '/consultations'} homeTo="/">
      <div className="flex-1 px-4 py-4 lg:px-10 lg:py-8">
        {consultation ? (
          <div className="mx-auto w-full max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <CardTitle className="wrap-anywhere text-2xl font-semibold sm:text-3xl">
                    <h2>{consultation.title?.trim() || 'Sin título'}</h2>
                  </CardTitle>
                  {consultation.isSuspended && <Badge variant="outline">Suspendida</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
                  {fields.map(({ label, value, to }) => (
                    <div key={label}>
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="mt-1 wrap-anywhere text-base font-medium">
                        {to ? (
                          <Button asChild variant="secondary" size="sm" className="h-auto max-w-full py-1.5 text-left whitespace-normal">
                            <Link to={to} className="no-underline">
                              <span className="min-w-0 wrap-anywhere">{value}</span>
                              <ChevronRight aria-hidden="true" />
                            </Link>
                          </Button>
                        ) : value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Separator />
                <div>
                  <h3 className="font-medium">Descripción</h3>
                  <p className="mt-1 wrap-anywhere whitespace-pre-wrap text-muted-foreground">
                    {consultation.description?.trim() || 'Sin descripción'}
                  </p>
                </div>
              </CardContent>
              {canManageConsultation && (
                <CardFooter className="flex-col-reverse justify-end gap-2 sm:flex-row">
                  {consultation.isSuspended ? (
                    <Button size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => changeSuspension(consultation.id, false)}>
                      Reactivar consulta
                    </Button>
                  ) : (
                    <>
                      <Button variant="destructive" size="lg" className="w-full sm:w-auto" disabled={isUpdating} onClick={() => setConsultationToSuspend(consultation.id)}>
                        Suspender consulta
                      </Button>
                      <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link to={`/consultations/${consultation.id}/edit`} state={{ fromConsultationDetail: true }}>
                          <Pencil aria-hidden="true" />
                          Editar consulta
                        </Link>
                      </Button>
                    </>
                  )}
                </CardFooter>
              )}
              {canManageConsultation && consultationToSuspend === consultation.id && (
                <ConfirmDialog
                  title="Suspender consulta"
                  confirmLabel="Suspender"
                  description={`¿Confirmás que querés suspender la consulta #${consultation.id}?`}
                  onClose={() => setConsultationToSuspend(null)}
                  onConfirm={() => changeSuspension(consultation.id, true)}
                />
              )}
            </Card>
            <ConsultationAttachmentsCard
              key={consultation.id}
              consultationId={id}
              initialAttachments={consultation.attachments ?? []}
              canManage={canManageConsultation && !consultation.isSuspended}
            />
          </div>
        ) : (
          <ListState
            isLoading={current === null}
            error={current?.error ?? ''}
            isEmpty
            loadingLabel="Cargando consulta..."
            emptyLabel="No se encontró la consulta."
          />
        )}
      </div>
    </ScreenShell>
  );
}
