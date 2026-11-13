import {
    CalendarDays,
    Gauge,
    HeartPulse,
    Pencil,
    Plus,
    Ruler,
    Trash2,
    Trophy,
    Weight,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import DeleteDialog from '@/components/custom/delete-dialog';
import ObservationForm from '@/components/custom/observation-form';
import { Button } from '@/components/ui/button';
import type { ObservationRatings, Observation } from '@/types/observation';

interface ObservationLogProps {
    horseId: number;
    records: Observation[];
    canEdit: boolean;
    ratings: ObservationRatings;
}

interface ObservationValue {
    label: string;
    icon: LucideIcon;
    text?: string;
    color?: string;
}

export function observationValues(record: Observation): ObservationValue[] {
    return [
        {
            label: 'Magasság',
            icon: Ruler,
            text: record.height_cm ? `${record.height_cm} cm` : undefined,
        },
        {
            label: 'Testsúly',
            icon: Weight,
            text: record.weight_kg ? `${record.weight_kg} kg` : undefined,
        },
        {
            label: 'Egészségi állapot',
            icon: HeartPulse,
            text: record.health_rating?.label,
            color: `health-${record.health_rating?.value}`,
        },
        {
            label: 'Teljesítmény',
            icon: Trophy,
            text: record.performance_rating?.label,
            color: `performance-${record.performance_rating?.value}`,
        },
        {
            label: 'Temperamentum',
            icon: Zap,
            text: record.disposition_rating?.label,
            color: `disposition-${record.disposition_rating?.value}`,
        },
        {
            label: 'Kondíció',
            icon: Gauge,
            text: record.bcs_rating?.label,
            color: `bcs-${record.bcs_rating?.value}`,
        },
    ];
}

export function ObservationChip({ item }: { item: ObservationValue }) {
    return (
        <span
            title={item.label}
            aria-label={`${item.label}: ${item.text}`}
            data-color={item.color}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium
                ${item.color ? 'bg-(--item-color) text-white' : 'bg-muted'}`}
        >
            <item.icon className="size-4 shrink-0" />
            {item.text}
        </span>
    );
}

export default function ObservationLog({
    horseId,
    records,
    canEdit,
    ratings,
}: ObservationLogProps) {
    const [form, setForm] = useState<{ record: Observation | null } | null>(null);
    const [removing, setRemoving] = useState<Observation | null>(null);

    const observationForm = form && (
        <ObservationForm
            key={form.record?.id ?? 'new'}
            horseId={horseId}
            record={form.record}
            ratings={ratings}
            onClose={() => setForm(null)}
        />
    );

    const renderRow = (record: Observation) => {
        const shownValues = observationValues(record).filter((item) => item.text);

        if (form?.record?.id === record.id) {
            return (
                <li key={record.id} className="py-3">
                    {observationForm}
                </li>
            );
        }

        return (
            <li key={record.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium tabular-nums">
                        <CalendarDays className="size-3.5 text-muted-foreground" />
                        {record.date}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {shownValues.map((item) => (
                            <ObservationChip key={item.label} item={item} />
                        ))}
                    </div>
                    {record.notes && (
                        <p className="text-xs text-muted-foreground italic">{record.notes}</p>
                    )}
                </div>

                {canEdit && (
                    <div className="flex shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Szerkesztés"
                            onClick={() => setForm({ record })}
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
                )}
            </li>
        );
    };

    return (
        <div className="space-y-4">
            {canEdit && !form && (
                <Button type="button" size="sm" onClick={() => setForm({ record: null })}>
                    <Plus /> Megfigyelés rögzítése
                </Button>
            )}

            {form && !form.record && observationForm}

            {records.length === 0 && (
                <p className="text-sm text-muted-foreground">Nincs megfigyelés.</p>
            )}

            <ul className="divide-y">{records.map(renderRow)}</ul>

            <DeleteDialog
                url={
                    removing && route('horses.observations.destroy', [horseId, removing.id])
                }
                message={
                    `Biztosan törlöd a(z) ${removing?.date} napi megfigyelést? ` +
                    'A törlés az előzményekből is eltávolítja.'
                }
                onClose={() => setRemoving(null)}
            />
        </div>
    );
}
