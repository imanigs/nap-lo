import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import DatePicker from '@/components/custom/date-picker';
import LogEntryRow from '@/components/custom/log-entry-row';
import TimeBadge from '@/components/custom/time-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import type { FeedRoutine } from '@/types/feed';
import type { Horse } from '@/types/horse';
import type { HorseHistoryData, LogEntry, LogKind } from '@/types/log-entry';

interface HorseHistoryProps {
    horse: Horse;
    history: HorseHistoryData;
    kinds: { value: LogKind; label: string }[];
}

function formatRoutine(routine: FeedRoutine) {
    if (routine.is_ad_lib) {
        return 'ad-lib';
    }

    const quantity = `${routine.quantity} ${routine.unit?.label ?? ''}`;
    const times = routine.times_of_day?.join(', ');

    if (routine.quantity !== null && times) {
        return `${quantity} | ${times}`;
    }

    if (routine.quantity !== null) {
        return quantity;
    }

    return times ?? '';
}

function RoutineRow({ horse, routine }: { horse: Horse; routine: FeedRoutine }) {
    const routineText = formatRoutine(routine);

    return (
        <li className="flex items-center gap-2">
            <Link
                href={route('horses.show', { horse: horse.id, tab: 'feed' })}
                className="flex min-w-0 flex-1 items-center gap-2"
            >
                <div className="min-w-0 flex-1 text-sm">
                    <p className="truncate">
                        <span className="text-foreground">{routine.label}</span>
                        {routineText && (
                            <span className="text-muted-foreground"> | {routineText}</span>
                        )}
                    </p>
                    {routine.notes && (
                        <p className="truncate text-xs text-muted-foreground">{routine.notes}</p>
                    )}
                </div>
                <TimeBadge>
                    {routine.starts_at} – {routine.ends_at ?? 'folyamatban'}
                </TimeBadge>
            </Link>
            <CategoryIcon kind="feed" category={routine.category} />
        </li>
    );
}

export default function HorseHistory({ horse, history, kinds }: HorseHistoryProps) {
    const [from, setFrom] = useState(history.from);
    const [to, setTo] = useState(history.to);
    const [selected, setSelected] = useState(history.kinds);
    const [loading, setLoading] = useState(false);

    const loadHistory = () => {
        router.reload({
            only: ['history'],
            data: { from, to, kinds: selected },
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const toggleKind = (kind: LogKind, checked: boolean) => {
        if (checked) {
            setSelected([...selected, kind]);

            return;
        }

        setSelected(selected.filter((item) => item !== kind));
    };

    const dates = [...new Set(history.log_entries.map((logEntry) => logEntry.date))];
    const today = format(new Date(), 'yyyy-MM-dd');

    const renderLabel = (logEntry: LogEntry) => {
        if (logEntry.done === false) {
            return (
                <Badge variant="outline">
                    {logEntry.date < today ? 'nem teljesült' : 'tervezett'}
                </Badge>
            );
        }

        if (logEntry.time) {
            return <TimeBadge>{logEntry.time}</TimeBadge>;
        }

        return null;
    };

    return (
        <div className="space-y-4">
            <div className="mx-auto grid max-w-sm grid-cols-2 gap-2">
                <DatePicker
                    id="from"
                    value={from}
                    onChange={(value) => value && setFrom(value)}
                />
                <DatePicker
                    id="to"
                    value={to}
                    onChange={(value) => value && setTo(value)}
                />
            </div>

            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:col-start-2">
                    {kinds.map((kind) => (
                        <label
                            key={kind.value}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                            <Checkbox
                                checked={selected.includes(kind.value)}
                                onCheckedChange={(checked) =>
                                    toggleKind(kind.value, checked === true)
                                }
                            />
                            {kind.label}
                        </label>
                    ))}
                </div>
                <Button
                    type="button"
                    onClick={loadHistory}
                    disabled={loading || selected.length === 0 || from > to}
                    className="justify-self-end sm:col-start-3 sm:row-start-1"
                >
                    Szűrés
                </Button>
            </div>

            {history.log_entries.length === 0 && history.routines.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Nincs bejegyzés ebben az időszakban.
                </p>
            )}

            {dates.map((date) => (
                <div key={date} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground tabular-nums">{date}</p>
                    <Card size="sm">
                        <CardContent>
                            <ul className="space-y-2">
                                {history.log_entries
                                    .filter((logEntry) => logEntry.date === date)
                                    .map((logEntry) => (
                                        <LogEntryRow
                                            key={logEntry.key}
                                            logEntry={logEntry}
                                            showNotes
                                            showHorse={false}
                                            label={renderLabel(logEntry)}
                                        />
                                    ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            ))}

            {history.routines.length > 0 && (
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Etetés</p>
                    <Card size="sm">
                        <CardContent>
                            <ul className="space-y-2">
                                {history.routines.map((routine) => (
                                    <RoutineRow key={routine.id} horse={horse} routine={routine} />
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
