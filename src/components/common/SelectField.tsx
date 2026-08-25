interface SelectFieldOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectFieldOption[];
  error?: string;
  hint?: string;
  disabled?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-[0.05em] text-[#526D82]">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full appearance-none rounded-xl border bg-white px-[14px] py-[13px] text-[15px] text-[#27374D] outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? 'border-[#c0392b]' : 'border-[#9DB2BF]'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-[12px] leading-4 text-[#c0392b]">{error}</span> : null}
      {!error && hint ? <span className="text-[12px] leading-4 text-[#526D82]">{hint}</span> : null}
    </div>
  );
}
