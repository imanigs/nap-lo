import { getISODay } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayBarProps {
    value: number[];
    onChange?: (days: number[]) => void;
    disabled?: boolean;
}

const DAYS = [
    { value: 1, short: 'H', name: 'Hétfő' },
    { value: 2, short: 'K', name: 'Kedd' },
    { value: 3, short: 'Sze', name: 'Szerda' },
    { value: 4, short: 'Cs', name: 'Csütörtök' },
    { value: 5, short: 'P', name: 'Péntek' },
    { value: 6, short: 'Szo', name: 'Szombat' },
    { value: 7, short: 'V', name: 'Vasárnap' },
];

const EVERY_DAY = [1, 2, 3, 4, 5, 6, 7];

export default function DayBar({ value, onChange, disabled }: DayBarProps) {
    const today = getISODay(new Date());
    const everyDay = value.length === 7;

    const toggleDay = (day: number) => {
        if (!onChange) {
            return;
        }

        if (value.includes(day)) {
            onChange(value.filter((selected) => selected !== day));

            return;
        }

        onChange([...value, day]);
    };

    return (
        <div className={onChange ? 'w-full max-w-sm space-y-2' : 'w-44 max-w-full space-y-0.5'}>
            {!onChange && (
                <div aria-hidden className="flex gap-px">
                    {DAYS.map((day) => (
                        <span
                            key={day.value}
                            className="flex h-3 flex-1 justify-center text-foreground/70"
                        >
                            {day.value === today && (
                                <ChevronDown className="size-3" strokeWidth={3} />
                            )}
                        </span>
                    ))}
                </div>
            )}

            <div
                className={cn(
                    'flex gap-px overflow-hidden rounded-full bg-border shadow-sm',
                    onChange ? 'h-8' : 'h-5',
                )}
            >
                {DAYS.map((day) => {
                    const active = value.includes(day.value);
                    const dayClassName = cn(
                        'flex flex-1 items-center justify-center',
                        onChange ? 'text-xs' : 'text-[10px]',
                        active
                            ? `bg-[color-mix(in_oklab,var(--item-color)_28%,white)] font-semibold
                                  text-(--item-color)`
                            : 'bg-muted',
                    );

                    if (!onChange) {
                        return (
                            <span key={day.value} title={day.name} className={dayClassName}>
                                {day.short}
                            </span>
                        );
                    }

                    return (
                        <button
                            key={day.value}
                            type="button"
                            title={day.name}
                            aria-pressed={active}
                            disabled={disabled}
                            onClick={() => toggleDay(day.value)}
                            className={cn(dayClassName, 'cursor-pointer disabled:opacity-50')}
                        >
                            {day.short}
                        </button>
                    );
                })}
            </div>

            {onChange && (
                <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={everyDay}
                    onClick={() => onChange(EVERY_DAY)}
                    className={cn(
                        'cursor-pointer rounded-full border px-2.5 py-0.5 text-xs',
                        'transition-colors disabled:opacity-50',
                        everyDay
                            ? `border-(--item-color)
                                  bg-[color-mix(in_oklab,var(--item-color)_12%,white)] font-medium
                                  text-(--item-color)`
                            : 'hover:border-main',
                    )}
                >
                    Minden nap
                </button>
            )}
        </div>
    );
}
