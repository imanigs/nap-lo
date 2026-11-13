import { cn } from '@/lib/utils';
import type { ExerciseIntensityOption } from '@/types/exercise';

interface IntensitySelectProps {
    options: ExerciseIntensityOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function IntensitySelect({
    options,
    value,
    onChange,
    disabled,
}: IntensitySelectProps) {
    return (
        <div role="radiogroup" aria-label="Intenzitás" className="flex flex-wrap gap-1.5">
            {options.map((option) => {
                const active = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={disabled}
                        onClick={() => onChange(active ? '' : option.value)}
                        data-color={option.value}
                        className={cn(
                            'cursor-pointer rounded-full border px-3 py-0.5 text-sm',
                            'transition-colors disabled:opacity-50',
                            active &&
                                'border-(--item-color) bg-(--item-color) font-medium text-white',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
