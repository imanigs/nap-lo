import { Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ObservationRatingOption } from '@/types/observation';

interface BodyConditionTableProps {
    options: ObservationRatingOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function BodyConditionTable({
    options,
    value,
    onChange,
    disabled,
}: BodyConditionTableProps) {
    return (
        <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-medium">
                <Gauge className="size-4" />
                Kondíció
            </span>

            <div
                role="radiogroup"
                aria-label="Kondíció"
                className="divide-y overflow-hidden rounded-lg border"
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
                            className={cn(
                                'grid w-full cursor-pointer grid-cols-[3rem_1fr_auto] items-center',
                                'text-left transition-colors disabled:cursor-default',
                                active ? 'bg-muted' : 'hover:bg-muted/50',
                            )}
                        >
                            <span
                                data-color={`bcs-${option.value}`}
                                className="flex items-center justify-center self-stretch
                                    bg-(--item-color) text-lg font-semibold text-white"
                            >
                                {option.value}
                            </span>
                            <span className={cn('px-3 py-1.5 text-sm', active && 'font-semibold')}>
                                {option.label}
                            </span>
                            <img
                                src={`/images/bcs/${option.value}.png`}
                                alt=""
                                className="m-2 w-32 sm:w-40"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
