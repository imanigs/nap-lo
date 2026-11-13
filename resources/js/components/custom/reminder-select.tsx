import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

interface ReminderSelectProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

const OPTIONS = [
    { value: '', label: 'Nincs' },
    { value: '7', label: '1 héttel előtte' },
    { value: '3', label: '3 nappal előtte' },
    { value: '1', label: '1 nappal előtte' },
];

export default function ReminderSelect({
    id,
    value,
    onChange,
    error,
    disabled,
}: ReminderSelectProps) {
    return (
        <Field>
            <FieldLabel htmlFor={id} className="text-xs font-medium">
                Emlékeztető
            </FieldLabel>
            <NativeSelect
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
                disabled={disabled}
            >
                {OPTIONS.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                        {option.label}
                    </NativeSelectOption>
                ))}
            </NativeSelect>
            {error && <FieldError>{error}</FieldError>}
        </Field>
    );
}
