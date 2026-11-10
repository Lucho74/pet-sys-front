import type { ComponentProps } from 'react';
import { SearchIcon } from 'lucide-react';
import { cn } from 'cn';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export function SearchInput({ className, ...props }: ComponentProps<'input'>) {
  return (
    <InputGroup className={cn('h-9 bg-white', className)}>
      <InputGroupAddon aria-hidden="true">
        <SearchIcon className="size-4 shrink-0" />
      </InputGroupAddon>
      <InputGroupInput type="search" className="h-full" {...props} />
    </InputGroup>
  );
}
