import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

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

// Label + Input + error de shadcn. Con type="password" suma el botón de ojo para mostrar/ocultar.
export function FormField({ label, error, type = 'text', onChange, ...inputProps }: FormFieldProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const props = {
    id,
    ...inputProps,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    'aria-invalid': Boolean(error),
  };

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      {type === 'password' ? (
        <InputGroup className="h-10 bg-white">
          <InputGroupInput type={showPassword ? 'text' : 'password'} {...props} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setShowPassword(!showPassword)}
              disabled={inputProps.disabled}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input type={type} className="h-10 bg-white" {...props} />
      )}

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
