interface DeleteDialogProps {
  selectedName: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ selectedName, isDeleting = false, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#27374D]/50 p-7">
      <div className="w-full rounded-2xl bg-white p-[22px] shadow-[0_12px_30px_rgba(39,55,77,0.3)]">
        <div className="mb-1.5 text-[16px] font-bold text-[#27374D]">Eliminar usuario</div>
        <div className="mb-5 text-[14px] leading-6 text-[#526D82]">
          ¿Confirmas que deseas eliminar a <strong className="text-[#27374D]">{selectedName}</strong>? Esta acción no se puede deshacer.
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-[10px] border border-[#9DB2BF] px-3 py-3 text-[14px] font-semibold text-[#526D82] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-[10px] bg-[#27374D] px-3 py-3 text-[14px] font-semibold text-[#DDE6ED] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
