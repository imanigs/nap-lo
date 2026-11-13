import { format, parseISO } from 'date-fns';
import { hu } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps {
    id: string;
    name?: string;
    label?: string;
    error?: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function DatePicker({
    id,
    name,
    label,
    error,
    value,
    placeholder = 'Válassz dátumot',
    onChange,
    disabled = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selected = value ? parseISO(value) : undefined;
    const emptyClass = selected ? '' : 'font-normal text-muted-foreground';
    const errorClass = error ? 'border-destructive text-destructive hover:border-destructive' : '';

    const handleSelect = (date: Date | undefined) => {
        onChange(date ? format(date, 'yyyy-MM-dd') : '');
        setIsOpen(false);
    };

    return (
        <Field>
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

            {name && <input type="hidden" name={name} value={value} />}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger
                    id={id}
                    disabled={disabled}
                    className={`flex h-10 w-full items-center justify-between rounded-md border
                        border-input bg-background px-3 py-2 text-sm font-medium
                        ring-offset-background transition-colors hover:bg-accent
                        hover:text-accent-foreground focus:ring-2 focus:ring-ring
                        focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed
                        disabled:opacity-50 ${emptyClass} ${errorClass}`}
                >
                    <span>{selected ? format(selected, 'yyyy-MM-dd.') : placeholder}</span>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                </PopoverTrigger>

                <PopoverContent className="w-auto p-4" align="start">
                    <Calendar
                        mode="single"
                        locale={hu}
                        selected={selected}
                        onSelect={handleSelect}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>

            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
