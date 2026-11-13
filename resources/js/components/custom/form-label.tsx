import type { ComponentProps } from 'react';
import { FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export default function FormLabel({ className, ...props }: ComponentProps<typeof FieldLabel>) {
    return <FieldLabel className={cn('text-xs font-medium', className)} {...props} />;
}
