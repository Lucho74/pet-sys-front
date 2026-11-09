import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { ImagePlus, PawPrint, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { initials } from '../../utils/initials';

export type PetPhotoChange = { kind: 'replace'; file: File; previewUrl: string } | { kind: 'remove' } | null;

interface PetPhotoFieldProps {
  petName: string;
  currentUrl?: string;
  isLoading: boolean;
  loadError: string;
  change: PetPhotoChange;
  onChange: (change: PetPhotoChange) => void;
  disabled: boolean;
}

export function PetPhotoField({ petName, currentUrl, isLoading, loadError, change, onChange, disabled }: PetPhotoFieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState('');
  const [failedImageUrl, setFailedImageUrl] = useState('');
  const previewUrl = change?.kind === 'replace' ? change.previewUrl : undefined;
  const imageUrl = change?.kind === 'remove' ? undefined : previewUrl ?? currentUrl;
  const imageError = imageUrl && failedImageUrl === imageUrl ? 'No se pudo mostrar la foto.' : '';

  useEffect(() => {
    if (previewUrl) return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    if (file.size === 0 || !['image/jpeg', 'image/png'].includes(file.type)) {
      setFileError('Elegí una foto JPG o PNG que no esté vacía.');
      return;
    }

    setFileError('');
    onChange({ kind: 'replace', file, previewUrl: URL.createObjectURL(file) });
  };

  const changePhoto = (nextChange: PetPhotoChange) => {
    setFileError('');
    onChange(nextChange);
  };

  return (
    <section aria-labelledby="pet-photo-heading" className="flex flex-wrap items-start gap-4 border-b pb-5">
      <Avatar className="size-40 overflow-hidden rounded-xl bg-muted after:rounded-xl sm:size-48">
        {imageUrl && (
          <AvatarImage
            className="rounded-none object-contain"
            src={imageUrl}
            alt={previewUrl ? 'Vista previa de la foto de la mascota' : 'Foto actual de la mascota'}
            onLoadingStatusChange={(status) => {
              if (status === 'error') setFailedImageUrl(imageUrl);
            }}
          />
        )}
        <AvatarFallback aria-hidden="true" className="rounded-none bg-primary text-3xl font-semibold text-primary-foreground">
          {initials(petName) || <PawPrint className="size-7" />}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 basis-40 space-y-2">
        <h2 id="pet-photo-heading" className="font-semibold">Foto de la mascota</h2>
        <p className="text-sm text-muted-foreground">JPG o PNG. Los cambios se aplican al guardar.</p>
        <input ref={input} type="file" accept="image/jpeg,image/png" hidden disabled={disabled} onChange={handleFile} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={disabled} onClick={() => input.current?.click()}>
            <ImagePlus aria-hidden="true" />
            {imageUrl ? 'Cambiar foto' : 'Agregar foto'}
          </Button>
          {currentUrl && change?.kind !== 'remove' && (
            <Button type="button" variant="outline" disabled={disabled} onClick={() => changePhoto({ kind: 'remove' })}>
              <Trash2 aria-hidden="true" />
              Quitar foto
            </Button>
          )}
          {change && (
            <Button type="button" variant="ghost" disabled={disabled} onClick={() => changePhoto(null)}>
              Deshacer cambio
            </Button>
          )}
        </div>
        {change?.kind === 'replace' && <p role="status" className="wrap-anywhere text-sm">Pendiente de guardar: {change.file.name}</p>}
        {change?.kind === 'remove' && <p role="status" className="text-sm">La foto se quitará al guardar.</p>}
        {!change && isLoading && <p role="status" className="text-sm text-muted-foreground">Cargando foto...</p>}
        {(imageError || (!change && loadError)) && (
          <p role="status" className="text-sm text-muted-foreground">{imageError || loadError}</p>
        )}
        {fileError && <p role="alert" className="text-sm text-destructive">{fileError}</p>}
      </div>
    </section>
  );
}
