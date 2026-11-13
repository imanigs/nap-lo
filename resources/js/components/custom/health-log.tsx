import { format } from 'date-fns';
import {
    CalendarDays,
    CalendarPlus,
    Check,
    Clock,
    Pencil,
    Plus,
    Repeat,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import DeleteDialog from '@/components/custom/delete-dialog';
import HealthForm from '@/components/custom/health-form';
import TimeBadge from '@/components/custom/time-badge';
import { Button } from '@/components/ui/button';
import type { HealthCategoryOption, HealthRecord, HealthRepeatUnitOption } from '@/types/health';

interface HealthLogProps {
    horseId: number;
    records: HealthRecord[];
    canEdit: boolean;
    categories: HealthCategoryOption[];
    repeatUnits: HealthRepeatUnitOption[];
}

export default function HealthLog({
    horseId,
    records,
    canEdit,
    categories,
    repeatUnits,
}: HealthLogProps) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const [form, setForm] = useState<{
        record: HealthRecord | null;
        complete: boolean;
        done: boolean;
    } | null>(null);
    const [removing, setRemoving] = useState<HealthRecord | null>(null);

    const upcoming = records.filter((record) => !record.done);
    const earlier = records.filter((record) => record.done).reverse();

    const healthForm = form && (
        <HealthForm
            key={form.record?.id ?? (form.done ? 'done' : 'planned')}
            horseId={horseId}
            record={form.record}
            complete={form.complete}
            done={form.done}
            categories={categories}
            repeatUnits={repeatUnits}
            onClose={() => setForm(null)}
        />
    );

    let removeMessage = `Biztosan törlöd ezt: ${removing?.label}?`;

    if (removing?.done) {
        removeMessage += ' Ez egy korábbi bejegyzés, a törlés az előzményekből is eltávolítja.';
    }

    const renderRow = (record: HealthRecord) => {
        if (form?.record?.id === record.id) {
            return (
                <li key={record.id} className="py-3">
                    {healthForm}
                </li>
            );
        }

        const overdue = record.date < today;

        return (
            <li key={record.id} className="flex items-start gap-3 py-3">
                <CategoryIcon kind="health" category={record.category} />
                <div className="min-w-0 flex-1 space-y-1">
                    <p className="flex flex-wrap items-center gap-x-2">
                        <span className="font-medium">{record.label}</span>
                        {!record.done && (
                            <span
                                className={
                                    overdue
                                        ? 'text-xs text-amber-700'
                                        : 'text-xs text-muted-foreground'
                                }
                            >
                                {overdue ? 'lejárt' : 'tervezett'}
                            </span>
                        )}
                    </p>
                    <p
                        className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm
                            text-muted-foreground"
                    >
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5" />
                            <span className="font-medium text-foreground tabular-nums">
                                {record.date}
                            </span>
                        </span>
                        {record.time && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <TimeBadge>{record.time}</TimeBadge>
                            </span>
                        )}
                        {record.repeat_every && record.repeat_unit && (
                            <span className="flex items-center gap-1.5">
                                <Repeat className="size-3.5" />
                                {record.repeat_every} {record.repeat_unit.label}
                            </span>
                        )}
                    </p>
                    {record.notes && (
                        <p className="text-xs text-muted-foreground italic">{record.notes}</p>
                    )}
                </div>

                {canEdit && (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Szerkesztés"
                                onClick={() =>
                                    setForm({ record, complete: false, done: record.done })
                                }
                            >
                                <Pencil />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Törlés"
                                onClick={() => setRemoving(record)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                        {!record.done && (
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setForm({ record, complete: true, done: false })}
                            >
                                <Check /> Kész
                            </Button>
                        )}
                    </div>
                )}
            </li>
        );
    };

    return (
        <div className="space-y-4">
            {canEdit && (!form || form.record) && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setForm({ record: null, complete: false, done: true })}
                    >
                        <Plus /> Bejegyzés rögzítése
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setForm({ record: null, complete: false, done: false })}
                    >
                        <CalendarPlus /> Bejegyzés tervezése
                    </Button>
                </div>
            )}

            {form && !form.record && healthForm}

            <h3 className="font-semibold">Aktuális</h3>

            {upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground">Nincs aktuális bejegyzés.</p>
            )}

            <ul className="divide-y">{upcoming.map(renderRow)}</ul>

            {earlier.length > 0 && (
                <details>
                    <summary className="cursor-pointer font-semibold">
                        Korábbi ({earlier.length})
                    </summary>
                    <ul className="mt-3 divide-y">{earlier.map(renderRow)}</ul>
                </details>
            )}

            <DeleteDialog
                url={removing && route('horses.health-records.destroy', [horseId, removing.id])}
                message={removeMessage}
                onClose={() => setRemoving(null)}
            />
        </div>
    );
}
