import { cn } from '@/lib/utils';

interface AdLibToggleProps {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

const OPTIONS = [
    { adLib: false, label: 'Kimért' },
    { adLib: true, label: 'Ad-lib' },
];

export default function AdLibToggle({ value, onChange, disabled }: AdLibToggleProps) {
    return (
        <div
            role="radiogroup"
            aria-label="Adagolás"
            className="flex w-fit gap-px overflow-hidden rounded-full bg-border shadow-sm"
        >
            {OPTIONS.map((option) => (
                <button
                    key={option.label}
                    type="button"
                    role="radio"
                    aria-checked={value === option.adLib}
                    disabled={disabled}
                    onClick={() => onChange(option.adLib)}
                    className={cn(
                        'cursor-pointer px-4 py-1 text-sm transition-colors disabled:opacity-50',
                        value === option.adLib
                            ? 'bg-(--item-color) font-medium text-white'
                            : 'bg-muted',
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
