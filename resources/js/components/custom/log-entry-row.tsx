import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import HorseAvatar from '@/components/custom/horse-avatar';
import { formatDetail } from '@/lib/log-entry';
import { cn } from '@/lib/utils';
import type { LogEntry } from '@/types/log-entry';

function logEntryHref(logEntry: LogEntry) {
    return route('horses.show', {
        horse: logEntry.horse.id,
        tab: logEntry.kind,
        month: logEntry.kind === 'exercise' ? logEntry.date.slice(0, 7) : undefined,
    });
}

interface LogEntryRowProps {
    logEntry: LogEntry;
    label?: ReactNode;
    subline?: ReactNode;
    action?: ReactNode;
    showNotes?: boolean;
    showHorse?: boolean;
    muted?: boolean;
}

export default function LogEntryRow({
    logEntry,
    label,
    subline,
    action,
    showNotes,
    showHorse = true,
    muted,
}: LogEntryRowProps) {
    const detailText = formatDetail(logEntry);

    let titleColor = 'text-foreground';

    if (showHorse) {
        titleColor = 'text-main-dark';
    }

    if (muted) {
        titleColor = '';
    }

    return (
        <li className="flex items-center gap-2">
            <Link
                href={logEntryHref(logEntry)}
                className="flex min-w-0 flex-1 items-center gap-2"
            >
                {showHorse && <HorseAvatar horse={logEntry.horse} />}
                <div className="min-w-0 flex-1 text-sm">
                    <p className={cn('truncate', muted && 'text-muted-foreground line-through')}>
                        {showHorse && (
                            <>
                                <span className="font-semibold">{logEntry.horse.name}</span>
                                <span className="text-muted-foreground"> | </span>
                            </>
                        )}
                        <span className={titleColor}>{logEntry.title}</span>
                        {detailText && (
                            <span className="text-muted-foreground"> | {detailText}</span>
                        )}
                    </p>
                    {showNotes && logEntry.detail.notes && (
                        <p className="truncate text-xs text-muted-foreground">
                            {logEntry.detail.notes}
                        </p>
                    )}
                    {subline && <div className="mt-0.5">{subline}</div>}
                </div>
                {label}
            </Link>
            {action}
            <CategoryIcon kind={logEntry.kind} category={logEntry.detail.category} />
        </li>
    );
}
