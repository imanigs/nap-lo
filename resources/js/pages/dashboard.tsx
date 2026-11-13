import { Head, router, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import ConfirmDialog from '@/components/custom/confirm-dialog';
import DashboardLog from '@/components/custom/dashboard-log';
import DashboardRow from '@/components/custom/dashboard-row';
import DeleteDialog from '@/components/custom/delete-dialog';
import FeedGroup from '@/components/custom/feed-group';
import NotificationCard from '@/components/custom/notification-card';
import TodoItems from '@/components/custom/todo-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { KINDS } from '@/lib/log-entry';
import type { LogEntry, LogKind } from '@/types/log-entry';
import type { AppNotification } from '@/types/notification';
import type { TodoList } from '@/types/todo';

const ORDER: LogKind[] = ['feed', 'exercise', 'health'];

interface DashboardTodoList extends TodoList {
    stable: { id: number; name: string };
}

export default function Dashboard() {
    const {
        today,
        notifications,
        items: all,
        todos,
    } = usePage<{
        today: string;
        notifications: AppNotification[];
        items: LogEntry[];
        todos: DashboardTodoList[];
    }>().props;
    const [shownKinds, setShownKinds] = useState<LogKind[]>(ORDER);
    const [completing, setCompleting] = useState<LogEntry | null>(null);
    const [removing, setRemoving] = useState<LogEntry | null>(null);
    const [processing, setProcessing] = useState(false);
    const [showPast, setShowPast] = useState(false);

    const complete = (item: LogEntry) => {
        const name =
            item.kind === 'exercise'
                ? 'horses.exercises.complete'
                : 'horses.health-records.complete';

        router.post(
            route(name, [item.horse.id, item.log_id]),
            item.kind === 'health'
                ? { date: today, time: item.date < today ? null : item.time }
                : {},
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => {
                    setProcessing(false);
                    setCompleting(null);
                },
            },
        );
    };

    const completeNote = (item: LogEntry) => {
        if (item.date >= today) {
            return '';
        }

        return item.kind === 'health'
            ? '\nA bejegyzés dátuma a mai nap lesz.'
            : `\nAz edzés dátuma marad: ${item.date}.`;
    };

    const rows = (list: LogEntry[]) => (
        <>
            {list.some((item) => item.kind === 'feed') && (
                <FeedGroup items={list.filter((item) => item.kind === 'feed')} />
            )}
            {list
                .filter((item) => item.kind !== 'feed')
                .map((item) => (
                    <DashboardRow
                        key={item.key}
                        item={item}
                        today={today}
                        onComplete={setCompleting}
                        onRemove={setRemoving}
                    />
                ))}
        </>
    );

    const toggle = (kind: LogKind) =>
        setShownKinds(
            shownKinds.includes(kind)
                ? shownKinds.filter((item) => item !== kind)
                : [...shownKinds, kind],
        );

    const items = all.filter((item) => shownKinds.includes(item.kind));
    const stables = [...new Map(todos.map((list) => [list.stable.id, list.stable])).values()];
    const now = new Date().toTimeString().slice(0, 5);
    const overdue = items.filter((item) => item.date < today);
    const allDay = items.filter((item) => item.time === null && item.date === today);
    const times = [
        ...new Set(
            items.filter((item) => item.time && item.date === today).map((item) => item.time!),
        ),
    ].sort();
    const past = times.filter((time) => time < now);
    const shown = showPast ? times : times.filter((time) => time >= now);
    const weekday = new Intl.DateTimeFormat('hu-HU', { weekday: 'long', timeZone: 'UTC' }).format(
        new Date(today),
    );

    return (
        <div className="mx-auto max-w-3xl space-y-4 p-3">
            <Head title="Főoldal" />
            {notifications.length > 0 && (
                <NotificationCard notifications={notifications} today={today} />
            )}

            <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm text-muted-foreground">
                    Ma | {weekday} | {today}
                </h2>

                <div className="flex gap-1.5">
                    {ORDER.map((kind) => {
                        const { icon: Icon, active: activeClass, label } = KINDS[kind];
                        const active = shownKinds.includes(kind);

                        return (
                            <Button
                                key={kind}
                                variant="outline"
                                size="icon"
                                aria-label={label}
                                aria-pressed={active}
                                title={label}
                                onClick={() => toggle(kind)}
                                className={
                                    active ? activeClass : 'text-muted-foreground opacity-50'
                                }
                            >
                                <Icon />
                            </Button>
                        );
                    })}
                </div>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-muted-foreground">Nincs mára bejegyzés.</p>
            )}

            {overdue.length > 0 && (
                <DashboardLog label="Korábban lejárt" labelOnTop>
                    {rows(overdue)}
                </DashboardLog>
            )}

            {allDay.length > 0 && <DashboardLog label="Egész nap">{rows(allDay)}</DashboardLog>}

            {past.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setShowPast(!showPast)}>
                    <ChevronDown className={showPast ? 'rotate-180' : ''} />
                    Elmúlt: {past.length} időpont
                </Button>
            )}

            {shown.map((time) => (
                <DashboardLog key={time} label={time}>
                    {rows(items.filter((item) => item.time === time && item.date === today))}
                </DashboardLog>
            ))}

            {todos.length > 0 && (
                <Card size="sm" className="gap-0 py-0">
                    <CardHeader className="bg-main py-2 text-white">
                        <CardTitle>Teendők</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-1.5 pb-3">
                        {stables.map((stable, index) => (
                            <div key={stable.id}>
                                {index > 0 && <Separator className="my-4" />}
                                <h3 className="text-center text-[15px] font-semibold">
                                    {stable.name}
                                </h3>

                                {todos
                                    .filter((list) => list.stable.id === stable.id)
                                    .map((list, listIndex) => (
                                        <div key={list.id}>
                                            {listIndex > 0 && <Separator className="my-2" />}
                                            <h4
                                                className="mb-1 text-xs font-semibold tracking-wide
                                                    text-muted-foreground uppercase"
                                            >
                                                {list.title}
                                            </h4>
                                            <TodoItems
                                                stableId={stable.id}
                                                list={list}
                                                canEdit={false}
                                            />
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <ConfirmDialog
                open={completing !== null}
                onOpenChange={(isOpen) => !isOpen && setCompleting(null)}
                onConfirm={() => completing && complete(completing)}
                message={
                    `Késznek jelölöd: ${completing?.horse.name} | ${completing?.title}?` +
                    (completing ? completeNote(completing) : '')
                }
                processing={processing}
                cancelLabel="Vissza"
                confirmLabel="Kész"
                confirmVariant="default"
            />

            <DeleteDialog
                url={
                    removing &&
                    route('horses.exercises.destroy', [removing.horse.id, removing.log_id])
                }
                message={
                    `Biztosan törlöd ezt az edzést: ` +
                    `${removing?.horse.name} | ${removing?.title}?`
                }
                onClose={() => setRemoving(null)}
            />
        </div>
    );
}
