import { KINDS } from '@/lib/log-entry';
import { cn } from '@/lib/utils';
import type { LogEntryDetail, LogKind } from '@/types/log-entry';

export default function CategoryIcon({
    kind,
    category,
}: {
    kind: LogKind;
    category?: LogEntryDetail['category'];
}) {
    const { icon: Icon, className } = KINDS[kind];
    const ownIcon = category?.icon;

    return (
        <span
            data-color={category?.value}
            className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-white',
                ownIcon ? 'bg-(--item-color)' : className,
            )}
        >
            {ownIcon ? (
                <img src={ownIcon} alt="" className="size-4 brightness-0 invert" />
            ) : (
                <Icon className="size-4" />
            )}
        </span>
    );
}
