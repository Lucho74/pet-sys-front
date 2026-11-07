import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  controlClasses,
  FIELD_ERROR_CLASSES,
  FIELD_HINT_CLASSES,
  FIELD_LABEL_CLASSES,
} from './fieldStyles';

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
  const selectId = useId();
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className={FIELD_LABEL_CLASSES}>
        {label}
      </label>

      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`appearance-none ${controlClasses(Boolean(error), 'pl-[14px] pr-[38px] py-[13px] lg:py-[11px]')}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9DB2BF]"
        />
      </div>

      {error ? (
        <span id={errorId} className={FIELD_ERROR_CLASSES}>
          {error}
        </span>
      ) : null}
      {!error && hint ? (
        <span id={hintId} className={FIELD_HINT_CLASSES}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
