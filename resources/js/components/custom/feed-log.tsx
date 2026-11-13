import { format } from 'date-fns';
import { CalendarDays, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import CategoryIcon from '@/components/custom/category-icon';
import DayBar from '@/components/custom/day-bar';
import FeedCardForm from '@/components/custom/feed-card-form';
import FeedRoutineRemoveDialog from '@/components/custom/feed-routine-remove-dialog';
import TimeBadge from '@/components/custom/time-badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { FeedCategoryOption, FeedRoutine, FeedUnitOption } from '@/types/feed';

interface FeedLogProps {
    horseId: number;
    routines: FeedRoutine[];
    canEdit: boolean;
    categories: FeedCategoryOption[];
    units: FeedUnitOption[];
}

function firstTime(routine: FeedRoutine) {
    return routine.times_of_day?.[0] ?? '99:99';
}

export default function FeedLog({ horseId, routines, canEdit, categories, units }: FeedLogProps) {
    const [editing, setEditing] = useState<FeedRoutine | 'new' | null>(null);
    const [removing, setRemoving] = useState<FeedRoutine | null>(null);

    const today = format(new Date(), 'yyyy-MM-dd');
    const past = routines
        .filter((routine) => routine.ends_at && routine.ends_at < today)
        .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
    const current = routines
        .filter((routine) => !routine.ends_at || routine.ends_at >= today)
        .sort((a, b) => firstTime(a).localeCompare(firstTime(b)));

    let pastEditing: FeedRoutine | null = null;

    if (editing && editing !== 'new' && !current.some((routine) => routine.id === editing.id)) {
        pastEditing = editing;
    }

    const renderForm = (routine: FeedRoutine | null) => (
        <FeedCardForm
            key={routine ? routine.id : 'new'}
            horseId={horseId}
            routine={routine}
            categories={categories}
            units={units}
            onClose={() => setEditing(null)}
        />
    );

    const renderRow = (routine: FeedRoutine) => {
        const measured = !routine.is_ad_lib && routine.unit && routine.quantity !== null;
        const everyDay = !routine.days_of_week || routine.days_of_week.length === 7;
        const times = routine.times_of_day ?? [];
        const showTimes = !routine.is_ad_lib && times.length > 0;

        return (
            <li key={routine.id} className="flex items-start gap-3 py-3">
                <CategoryIcon kind="feed" category={routine.category} />
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{routine.label}</span>
                        <Separator orientation="vertical" className="h-4" />
                        {measured ? (
                            <>
                                <span className="text-muted-foreground">
                                    {routine.quantity} {routine.unit?.label}
                                </span>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-muted-foreground">
                                    napi {times.length}x
                                </span>
                            </>
                        ) : (
                            <span className="text-muted-foreground">ad-lib</span>
                        )}
                    </div>
                    {showTimes && (
                        <p className="flex flex-wrap items-center gap-1.5 text-sm">
                            <Clock className="size-3.5 text-muted-foreground" />
                            {times.map((time) => (
                                <TimeBadge key={time}>{time}</TimeBadge>
                            ))}
                        </p>
                    )}
                    {!routine.is_ad_lib && everyDay && (
                        <p className="text-xs text-muted-foreground">minden nap</p>
                    )}
                    {!routine.is_ad_lib && !everyDay && (
                        <div data-color={routine.category.value}>
                            <DayBar value={routine.days_of_week ?? []} />
                        </div>
                    )}
                    {routine.ends_at && (
                        <p className="flex items-center gap-1.5 pt-1.5 text-sm">
                            <CalendarDays className="size-3.5 text-muted-foreground" />
                            <TimeBadge>{routine.starts_at}</TimeBadge>
                            <span className="text-muted-foreground">–</span>
                            <TimeBadge>{routine.ends_at}</TimeBadge>
                        </p>
                    )}
                    {routine.notes && (
                        <p className="text-xs text-muted-foreground italic">{routine.notes}</p>
                    )}
                </div>

                {canEdit && (
                    <div className="flex shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Szerkesztés"
                            onClick={() => setEditing(routine)}
                        >
                            <Pencil />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Törlés"
                            onClick={() => setRemoving(routine)}
                        >
                            <Trash2 />
                        </Button>
                    </div>
                )}
            </li>
        );
    };

    return (
        <div className="space-y-4">
            {current.length === 0 && !canEdit && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    Nincs jelenleg érvényes etetési rutin.
                </p>
            )}

            {canEdit && editing !== 'new' && (
                <Button type="button" size="sm" onClick={() => setEditing('new')}>
                    <Plus /> Új rutin
                </Button>
            )}

            {editing === 'new' && renderForm(null)}
            {pastEditing && renderForm(pastEditing)}

            <ul className="divide-y">
                {current.map((routine) => {
                    if (editing !== 'new' && editing?.id === routine.id) {
                        return (
                            <li key={routine.id} className="py-3">
                                {renderForm(routine)}
                            </li>
                        );
                    }

                    return renderRow(routine);
                })}
            </ul>

            {past.length > 0 && (
                <details>
                    <summary className="cursor-pointer font-semibold">
                        Korábbi ({past.length})
                    </summary>
                    <ul className="mt-3 divide-y">{past.map(renderRow)}</ul>
                </details>
            )}

            {removing && (
                <FeedRoutineRemoveDialog
                    key={removing.id}
                    horseId={horseId}
                    routine={removing}
                    onClose={() => setRemoving(null)}
                />
            )}
        </div>
    );
}
