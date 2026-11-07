import type { ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface FormShellProps {
  children: ReactNode;
  formError: string;
  isLoading?: boolean;
  isSaving?: boolean;
  loadingLabel: string;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

// Contenedor de los formularios de crear/editar: tarjeta, error general y botones.
export function FormShell({
  children,
  formError,
  isLoading = false,
  isSaving = false,
  loadingLabel,
  onCancel,
  onSave,
  saveLabel,
}: FormShellProps) {
  return (
    <div className="flex-1 overflow-auto px-4 pb-8 pt-5 lg:px-10 lg:pb-12 lg:pt-8">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-[760px]"
      >
        <Card className="gap-6 py-6">
          <CardContent className="px-6">
            {isLoading ? (
              <div role="status" className="flex items-center justify-center gap-2 py-6">
                <Spinner /> {loadingLabel}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">{children}</div>
            )}

            {formError && (
              <Alert variant="destructive" className="mt-5">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="justify-end gap-2.5 px-6 pb-6">
            <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={isSaving || isLoading}>
              {isSaving ? 'Guardando...' : saveLabel}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
