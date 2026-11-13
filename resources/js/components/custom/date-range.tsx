import DatePicker from '@/components/custom/date-picker';

interface DateRangeProps {
    startsAt: string;
    endsAt: string;
    onStartsAtChange: (value: string) => void;
    onEndsAtChange: (value: string) => void;
    startsAtId: string;
    endsAtId: string;
    startsAtError?: string;
    endsAtError?: string;
    disabled?: boolean;
}

export default function DateRange({
    startsAt,
    endsAt,
    onStartsAtChange,
    onEndsAtChange,
    startsAtId,
    endsAtId,
    startsAtError,
    endsAtError,
    disabled,
}: DateRangeProps) {
    return (
        <>
            <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                    <DatePicker
                        id={startsAtId}
                        value={startsAt}
                        onChange={onStartsAtChange}
                        error={startsAtError}
                        disabled={disabled}
                    />
                </div>
                <span className="pt-2">–</span>
                <div className="min-w-0 flex-1">
                    <DatePicker
                        id={endsAtId}
                        value={endsAt}
                        onChange={onEndsAtChange}
                        error={endsAtError}
                        placeholder="Folyamatos"
                        disabled={disabled}
                    />
                </div>
            </div>
            {endsAt && (
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onEndsAtChange('')}
                    className="w-fit cursor-pointer text-xs underline underline-offset-4"
                >
                    Nincs vége, folyamatos
                </button>
            )}
        </>
    );
}
