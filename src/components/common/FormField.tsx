interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  min?: number;
}

export function FormField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  disabled = false,
  maxLength,
  min,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
        {label}
      </label>
      <input
        type={type}
        min={min}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-[#c0392b]' : 'border-[#9DB2BF]'
        }`}
      />
      {error ? <span className="text-[12px] leading-4 text-[#c0392b]">{error}</span> : null}
    </div>
  );
}
