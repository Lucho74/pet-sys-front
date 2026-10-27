import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { controlClasses, FIELD_ERROR_CLASSES, FIELD_LABEL_CLASSES } from './fieldStyles';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  autoComplete?: string;
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
  max,
  autoComplete,
}: FormFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          min={min}
          max={max}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={
            isPassword
              ? controlClasses(Boolean(error), 'py-[13px] pl-[14px] pr-11 lg:py-[11px]')
              : controlClasses(Boolean(error))
          }
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#526D82] transition-colors hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D]/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <span id={errorId} className={FIELD_ERROR_CLASSES}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
