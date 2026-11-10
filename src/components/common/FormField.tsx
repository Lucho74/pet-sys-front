import { useId, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';

interface FormFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  autoComplete?: string;
}

export function FormField({ label, error, type = 'text', onChange, ...inputProps }: FormFieldProps) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const props = {
    id,
    ...inputProps,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(event.target.value),
    'aria-invalid': Boolean(error),
  };

  let control;
  if (type === 'password') {
    control = (
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
    );
  } else if (type === 'textarea') {
    control = <Textarea className="min-h-32 bg-white" {...props} />;
  } else {
    control = <Input type={type} className="h-10 bg-white read-only:bg-muted" {...props} />;
  }

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {control}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
