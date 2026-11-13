import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ObservationRatingOption } from '@/types/observation';

interface RatingScaleProps {
    label: string;
    scale: string;
    icon: LucideIcon;
    options: ObservationRatingOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function RatingScale({
    label,
    scale,
    icon: Icon,
    options,
    value,
    onChange,
    disabled,
}: RatingScaleProps) {
    return (
        <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium">
                <Icon className="size-4" />
                {label}
            </span>

            <div
                role="radiogroup"
                aria-label={label}
                className="flex gap-0.5 overflow-hidden rounded-lg"
            >
                {options.map((option) => {
                    const active = option.value.toString() === value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            disabled={disabled}
                            onClick={() => onChange(active ? '' : option.value.toString())}
                            data-color={`${scale}-${option.value}`}
                            className={cn(
                                'flex flex-1 cursor-pointer items-center justify-center',
                                'bg-(--item-color) px-1 py-1 text-center text-xs leading-tight',
                                'text-white transition-opacity hover:opacity-100',
                                'disabled:cursor-default sm:text-sm',
                                active &&
                                    'font-semibold shadow-[inset_0_0_0_3px_rgba(255,255,255,0.7)]',
                                value !== '' && !active && 'opacity-40',
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
