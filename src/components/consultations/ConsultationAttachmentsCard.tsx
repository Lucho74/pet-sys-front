import { useId, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ExternalLink, FileText, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import type { IConsultationAttachment } from '../../services/consultation/IConsultation';
import {
  handleDeleteConsultationAttachment,
  handleGetByIdConsultation,
  handleGetConsultationAttachmentUrl,
  handleUploadConsultationAttachment,
} from '../../services/consultation/consultationService';
import { errorMessage } from '../../utils/errors';
import { ConfirmDialog } from '../common/ConfirmDialog';

const ATTACHMENT_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

interface ConsultationAttachmentsCardProps {
  consultationId: string;
  initialAttachments: IConsultationAttachment[];
  canManage: boolean;
}

function normalizeFile(file: File): File | null {
  const extension = file.name.match(/\.(pdf|docx)$/i)?.[1]?.toLowerCase();
  if (file.size === 0 || (extension !== 'pdf' && extension !== 'docx')) return null;

  const type = ATTACHMENT_TYPES[extension];
  if (file.type === type) return file;
  if (file.type && file.type !== 'application/octet-stream') return null;

  return new File([file], file.name, { type, lastModified: file.lastModified });
}

export function ConsultationAttachmentsCard({ consultationId, initialAttachments, canManage }: ConsultationAttachmentsCardProps) {
  const headingId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [opening, setOpening] = useState<string | null>(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState<{ blobName: string; label: string } | null>(null);
  const canChangeAttachments = canManage && !isUpdating && !needsRefresh;

  const refreshAttachments = async () => {
    setIsUpdating(true);
    try {
      const consultation = await handleGetByIdConsultation(consultationId);
      setAttachments(consultation.attachments ?? []);
      setNeedsRefresh(false);
    } catch {
      setNeedsRefresh(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!selected || !canChangeAttachments) return;

    const file = normalizeFile(selected);
    if (!file) {
      setError('Solo podés adjuntar archivos PDF o DOCX que no estén vacíos.');
      return;
    }

    setIsUpdating(true);
    setError('');
    try {
      await handleUploadConsultationAttachment(consultationId, file);
    } catch (error) {
      setError(errorMessage(error, 'No se pudo adjuntar el archivo.'));
      setIsUpdating(false);
      return;
    }

    await refreshAttachments();
  };

  const deleteAttachment = async (blobName: string) => {
    if (!canChangeAttachments) return;

    setIsUpdating(true);
    setError('');
    try {
      await handleDeleteConsultationAttachment(consultationId, blobName);
      setAttachments((current) => current.filter((attachment) => attachment.blobName !== blobName));
    } catch (error) {
      setError(errorMessage(error, 'No se pudo eliminar el adjunto.'));
    } finally {
      setIsUpdating(false);
    }
  };

  const openAttachment = async (blobName: string) => {
    if (opening) return;
    setError('');

    const tab = window.open('', '_blank');
    if (!tab) {
      setError('El navegador bloqueó la apertura del adjunto.');
      return;
    }

    tab.opener = null;
    setOpening(blobName);
    try {
      const url = await handleGetConsultationAttachmentUrl(consultationId, blobName);
      if (!tab.closed) tab.location.replace(url);
    } catch (error) {
      tab.close();
      setError(errorMessage(error, 'No se pudo abrir el adjunto.'));
    } finally {
      setOpening(null);
    }
  };

  return (
    <Card role="region" aria-labelledby={headingId}>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle><h2 id={headingId}>Adjuntos</h2></CardTitle>
          {canManage && <p className="mt-1 text-sm text-muted-foreground">PDF o DOCX</p>}
        </div>
        {canManage && (
          <>
            <input ref={input} type="file" accept=".pdf,.docx" hidden disabled={!canChangeAttachments} onChange={handleFile} />
            <Button type="button" variant="outline" disabled={!canChangeAttachments} onClick={() => input.current?.click()}>
              <Paperclip aria-hidden="true" />
              Adjuntar archivo
            </Button>
          </>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {isUpdating && <Spinner className="text-muted-foreground" aria-label="Actualizando adjuntos" />}
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {needsRefresh && (
          <div className="space-y-2">
            <p role="alert" className="text-sm text-destructive">El archivo se subió, pero no se pudo actualizar la lista.</p>
            <Button type="button" variant="outline" size="sm" disabled={isUpdating} onClick={refreshAttachments}>
              Actualizar lista
            </Button>
          </div>
        )}
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay archivos adjuntos.</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {attachments.map(({ blobName, fileName }, index) => {
              const label = fileName?.trim() || `Adjunto ${index + 1}${blobName.match(/\.(pdf|docx)$/i)?.[0] ?? ''}`;

              return (
                <li key={blobName} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="wrap-anywhere">{label}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button type="button" variant="ghost" size="sm" aria-label={`Abrir ${label}`} disabled={opening !== null || isUpdating} onClick={() => openAttachment(blobName)}>
                      <ExternalLink aria-hidden="true" />
                      {opening === blobName ? 'Abriendo...' : 'Abrir'}
                    </Button>
                    {canManage && (
                      <Button type="button" variant="ghost" size="sm" aria-label={`Eliminar ${label}`} disabled={!canChangeAttachments} onClick={() => setAttachmentToDelete({ blobName, label })}>
                        Eliminar
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>

      {canManage && attachmentToDelete && (
        <ConfirmDialog
          title="Eliminar adjunto"
          description={`¿Confirmás que querés eliminar ${attachmentToDelete.label}?`}
          confirmLabel="Eliminar"
          confirmVariant="destructive"
          onClose={() => setAttachmentToDelete(null)}
          onConfirm={() => deleteAttachment(attachmentToDelete.blobName)}
        />
      )}
    </Card>
  );
}
