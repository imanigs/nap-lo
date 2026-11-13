import CategoryIcon from '@/components/custom/category-icon';
import { cn } from '@/lib/utils';
import type { LogKind } from '@/types/log-entry';

interface CategoryOption {
    value: string;
    label: string;
    icon: string | null;
}

interface CategorySelectorProps {
    kind: LogKind;
    options: CategoryOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function CategorySelector({
    kind,
    options,
    value,
    onChange,
    disabled,
}: CategorySelectorProps) {
    return (
        <div role="radiogroup" className="flex flex-wrap gap-2">
            {options.map((option) => {
                const selected = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={disabled}
                        onClick={() => onChange(option.value)}
                        data-color={option.value}
                        className={cn(
                            'flex w-20 cursor-pointer flex-col items-center gap-1 rounded-lg',
                            'border-2 border-transparent p-2 text-center text-xs transition-all',
                            selected
                                ? 'border-(--item-color) font-semibold'
                                : `[&>span]:opacity-50 [&>span]:grayscale
                                      hover:[&>span]:opacity-100 hover:[&>span]:grayscale-0`,
                        )}
                    >
                        <CategoryIcon kind={kind} category={option} />
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
