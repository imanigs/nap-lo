import { Check, X } from 'lucide-react';
import LogEntryRow from '@/components/custom/log-entry-row';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LogEntry } from '@/types/log-entry';

interface DashboardRowProps {
    item: LogEntry;
    today: string;
    onComplete: (item: LogEntry) => void;
    onRemove: (item: LogEntry) => void;
}

function Actions({ item, today, onComplete, onRemove }: DashboardRowProps) {
    if (item.done === true) {
        return (
            <span
                role="img"
                aria-label="Kész"
                className="flex size-7 items-center justify-center rounded-full bg-muted
                    text-muted-foreground"
            >
                <Check className="size-4" />
            </span>
        );
    }

    if (!item.can_edit) {
        return null;
    }

    const canComplete = item.kind !== 'exercise' || item.date <= today;
    const canRemove = item.kind === 'exercise' && item.date < today;

    return (
        <>
            {canComplete && (
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Kész"
                    onClick={() => onComplete(item)}
                >
                    <Check />
                </Button>
            )}
            {canRemove && (
                <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label="Törlés"
                    onClick={() => onRemove(item)}
                >
                    <X />
                </Button>
            )}
        </>
    );
}

export default function DashboardRow({ item, today, onComplete, onRemove }: DashboardRowProps) {
    const overdue = item.done !== true && item.date < today;

    return (
        <LogEntryRow
            logEntry={item}
            muted={item.done === true}
            subline={overdue && <Badge variant="destructive">{item.date}</Badge>}
            action={
                <Actions
                    item={item}
                    today={today}
                    onComplete={onComplete}
                    onRemove={onRemove}
                />
            }
        />
    );
}
