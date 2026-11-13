import { Head, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import LogEntryRow from '@/components/custom/log-entry-row';
import MonthCalendar from '@/components/custom/month-calendar';
import TimeBadge from '@/components/custom/time-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Separator } from '@/components/ui/separator';
import { KINDS } from '@/lib/log-entry';
import { cn } from '@/lib/utils';
import type { LogEntry, LogKind } from '@/types/log-entry';

const ORDER: LogKind[] = ['feed', 'exercise', 'health', 'observation'];

function kindsForUrl(kinds: LogKind[]) {
    if (kinds.length > 0) {
        return kinds;
    }

    return '';
}

export default function Calendar() {
    const { month, day, horse, kinds, horses, days, selected } = usePage<{
        month: string;
        day: string;
        horse: number | null;
        kinds: LogKind[];
        horses: { id: number; name: string }[];
        days: Record<string, Partial<Record<LogKind, number>>>;
        selected: LogEntry[];
    }>().props;

    const reloadWith = (changes: object) =>
        router.get(
            route('calendar'),
            { month, day, horse: horse ?? undefined, kinds: kindsForUrl(kinds), ...changes },
            { preserveScroll: true, preserveState: true },
        );

    const toggleKind = (kind: LogKind, checked: boolean) => {
        let newKinds = kinds.filter((item) => item !== kind);

        if (checked) {
            newKinds = [...kinds, kind];
        }

        reloadWith({ kinds: kindsForUrl(newKinds) });
    };

    const allDay = selected.filter((logEntry) => !logEntry.time);
    const timed = selected.filter((logEntry) => logEntry.time);

    const row = (logEntry: LogEntry) => (
        <LogEntryRow
            key={logEntry.key}
            logEntry={logEntry}
            showNotes
            label={
                logEntry.time && (
                    <TimeBadge>
                        {logEntry.done ? `kész | ${logEntry.time}` : logEntry.time}
                    </TimeBadge>
                )
            }
        />
    );

    return (
        <div className="mx-auto max-w-3xl space-y-4 p-3 lg:max-w-5xl">
            <Head title="Naptár" />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
                {ORDER.map((kind) => (
                    <label key={kind} className="flex cursor-pointer items-center gap-1.5 text-sm">
                        <Checkbox
                            checked={kinds.includes(kind)}
                            onCheckedChange={(checked) => toggleKind(kind, checked === true)}
                        />
                        <span className={cn('size-2.5 rounded-full', KINDS[kind].className)} />
                        {KINDS[kind].label}
                    </label>
                ))}
            </div>

            <NativeSelect
                value={horse?.toString() ?? ''}
                onChange={(e) => reloadWith({ horse: e.target.value || undefined })}
                className="w-full"
                aria-label="Ló"
            >
                <NativeSelectOption value="">Minden ló</NativeSelectOption>
                {horses.map((item) => (
                    <NativeSelectOption key={item.id} value={item.id}>
                        {item.name}
                    </NativeSelectOption>
                ))}
            </NativeSelect>

            <div className="grid gap-4 lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-6">
                <MonthCalendar
                    month={month}
                    selected={day}
                    onSelect={(date) => reloadWith({ day: date })}
                    onMonthChange={(next) => reloadWith({ month: next, day: undefined })}
                    renderDay={(date) =>
                        ORDER.filter((kind) => days[date]?.[kind]).map((kind) => (
                            <span
                                key={kind}
                                className={cn('size-2 rounded-full', KINDS[kind].className)}
                            />
                        ))
                    }
                />

                <section className="min-w-0 space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground tabular-nums">
                        {day}
                    </h3>

                    {selected.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Ezen a napon nincs bejegyzés.
                        </p>
                    ) : (
                        <Card size="sm">
                            <CardContent className="space-y-3">
                                {allDay.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Egész nap
                                        </p>
                                        <ul className="space-y-2">{allDay.map(row)}</ul>
                                    </div>
                                )}

                                {allDay.length > 0 && timed.length > 0 && <Separator />}

                                {timed.length > 0 && (
                                    <ul className="space-y-2">{timed.map(row)}</ul>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </section>
            </div>
        </div>
    );
}
