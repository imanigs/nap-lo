import { Head, Link, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import DeleteDialog from '@/components/custom/delete-dialog';
import HorseAvatar from '@/components/custom/horse-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Reminder } from '@/types/reminder';

const beforeText = (days: number) => (days % 7 === 0 ? `${days / 7} hét` : `${days} nap`);

export default function Reminders() {
    const { reminders } = usePage<{ reminders: Reminder[] }>().props;
    const [removing, setRemoving] = useState<Reminder | null>(null);

    return (
        <div className="mx-auto max-w-3xl space-y-4 p-3">
            <Head title="Emlékeztetők" />
            <h1 className="text-lg font-bold">Emlékeztetők</h1>

            {reminders.length === 0 ? (
                <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Nincs beállított emlékeztető.</p>
                    <p>Emlékeztetőt egy egészségügyi bejegyzéshez lehet kérni.</p>
                </div>
            ) : (
                <Card size="sm">
                    <CardContent>
                        <ul className="space-y-3">
                            {reminders.map((reminder) => (
                                <li key={reminder.id} className="flex items-center gap-2">
                                    <Link
                                        href={route('horses.show', {
                                            horse: reminder.log_entry.horse.id,
                                            tab: reminder.log_entry.kind,
                                        })}
                                        className="flex min-w-0 flex-1 items-center gap-2"
                                    >
                                        <HorseAvatar horse={reminder.log_entry.horse} />
                                        <div className="min-w-0 text-sm">
                                            <p className="truncate">
                                                <span className="font-semibold">
                                                    {reminder.log_entry.horse.name}
                                                </span>
                                                <span className="text-muted-foreground"> | </span>
                                                <span className="text-main-dark">
                                                    {reminder.log_entry.title}
                                                </span>
                                            </p>
                                            <p
                                                className="text-xs text-muted-foreground
                                                    tabular-nums"
                                            >
                                                Időpont: {reminder.log_entry.date}
                                                {reminder.log_entry.time &&
                                                    ` ${reminder.log_entry.time}`}
                                            </p>
                                        </div>
                                    </Link>
                                    <span
                                        className="shrink-0 text-right text-xs
                                            text-muted-foreground"
                                    >
                                        {beforeText(reminder.days_before)}
                                    </span>
                                    <CategoryIcon
                                        kind={reminder.log_entry.kind}
                                        category={reminder.log_entry.detail.category}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label="Emlékeztető törlése"
                                        onClick={() => setRemoving(reminder)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            <DeleteDialog
                url={removing && route('reminders.destroy', removing.id)}
                message={
                    `Törlöd az emlékeztetőt: ${removing?.log_entry.horse.name} | ` +
                    `${removing?.log_entry.title}?`
                }
                onClose={() => setRemoving(null)}
            />
        </div>
    );
}
