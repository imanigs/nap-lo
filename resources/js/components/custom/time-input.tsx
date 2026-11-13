import { X } from 'lucide-react';
import { TimePicker } from '@/components/reui/time-picker';

interface TimeInputProps {
    value: string;
    onChange: (time: string) => void;
    onRemove?: () => void;
    disabled?: boolean;
}

const LABELS = {
    placeholder: '--:--',
    hour: 'Óra',
    minute: 'Perc',
    now: 'Most',
    clear: 'Törlés',
    confirm: 'OK',
    panelLabel: 'Időpont választása',
    openPicker: 'Időpont választó megnyitása',
};

export default function TimeInput({ value, onChange, onRemove, disabled }: TimeInputProps) {
    const handleRemove = () => {
        if (onRemove) {
            onRemove();

            return;
        }

        onChange('');
    };

    return (
        <div className="flex w-fit items-center gap-1">
            <TimePicker
                value={value || null}
                onValueChange={(next) => onChange(next ?? '')}
                minuteStep={5}
                disabled={disabled}
                aria-label="Időpont"
                i18n={{ labels: LABELS }}
                className="w-28"
            />
            {(onRemove || value) && (
                <button
                    type="button"
                    aria-label="Időpont törlése"
                    disabled={disabled}
                    onClick={handleRemove}
                    className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted
                        hover:text-foreground disabled:opacity-50"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
