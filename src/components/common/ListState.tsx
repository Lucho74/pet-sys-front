import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription } from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

interface ListStateProps {
  isLoading: boolean;
  error: string;
  isEmpty: boolean;
  loadingLabel: string;
  emptyLabel: string;
}

export function ListState({ isLoading, error, isEmpty, loadingLabel, emptyLabel }: ListStateProps) {
  if (isLoading) {
    return (
      <div role="status" className="flex min-h-[220px] items-center justify-center gap-2">
        <Spinner /> {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[220px] items-center justify-center">
        <Alert variant="destructive" className="max-w-[460px]">
          <AlertDescription className="flex flex-col items-start gap-3">
            {error}
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <Empty className="min-h-[220px] border border-dashed bg-white">
        <EmptyDescription>{emptyLabel}</EmptyDescription>
      </Empty>
    );
  }

  return null;
}
