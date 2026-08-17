interface FormProps {
  form: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  };
  formError: string;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function Form({
  form,
  formError,
  onFullNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onCancel,
  onSave,
  saveLabel,
}: FormProps) {
  return (
    <div className="flex-1 overflow-auto px-5 pb-6 pt-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Nombre completo
          </label>
          <input
            value={form.fullName}
            onChange={(event) => onFullNameChange(event.target.value)}
            placeholder="Nombre y apellido"
            className="w-full rounded-xl border border-[#9DB2BF] bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Correo
          </label>
          <input
            value={form.email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="usuario@empresa.com"
            className="w-full rounded-xl border border-[#9DB2BF] bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Teléfono
          </label>
          <input
            value={form.phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            placeholder="+54 9 11 1234 5678"
            className="w-full rounded-xl border border-[#9DB2BF] bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
            Contraseña
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[#9DB2BF] bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400"
          />
        </div>

        {formError ? (
          <div className="rounded-[10px] border border-[#9DB2BF] bg-white px-3 py-2.5 text-[13px] text-[#27374D]">
            {formError}
          </div>
        ) : null}

        <div className="mt-1.5 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[#526D82] px-4 py-[14px] text-[15px] font-semibold text-[#526D82]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex-1 rounded-xl bg-[#27374D] px-4 py-[14px] text-[15px] font-semibold text-[#DDE6ED]"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
