import { useId } from 'react';
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
  autoComplete,
}: FormFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        min={min}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={controlClasses(Boolean(error))}
      />
      {error ? (
        <span id={errorId} className={FIELD_ERROR_CLASSES}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
