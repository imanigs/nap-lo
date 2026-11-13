import { router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { hu } from 'date-fns/locale';
import { CalendarPlus, Check, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import DeleteDialog from '@/components/custom/delete-dialog';
import ExerciseForm from '@/components/custom/exercise-form';
import MonthCalendar from '@/components/custom/month-calendar';
import TimeBadge from '@/components/custom/time-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/log-entry';
import { cn } from '@/lib/utils';
import type { Exercise, ExerciseCategoryOption, ExerciseIntensityOption } from '@/types/exercise';

interface ExerciseLogProps {
    horseId: number;
    month: string;
    exercises: Exercise[];
    canEdit: boolean;
    categories: ExerciseCategoryOption[];
    intensities: ExerciseIntensityOption[];
}

export default function ExerciseLog({
    horseId,
    month,
    exercises,
    canEdit,
    categories,
    intensities,
}: ExerciseLogProps) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const [selected, setSelected] = useState<string | null>(today.startsWith(month) ? today : null);
    const [form, setForm] = useState<{
        exercise: Exercise | null;
        complete: boolean;
        done: boolean;
    } | null>(null);
    const [removing, setRemoving] = useState<Exercise | null>(null);

    const changeMonth = (next: string) => {
        setSelected(null);
        setForm(null);
        router.reload({
            data: { month: next },
            only: ['exerciseMonth', 'exercises'],
            replace: true,
        });
    };

    const selectDay = (date: string) => {
        setSelected(date);
        setForm(null);
    };

    const dayExercises = exercises.filter((exercise) => exercise.date === selected);

    const exerciseForm = form && selected && (
        <ExerciseForm
            key={form.exercise?.id ?? (form.done ? 'done' : 'planned')}
            horseId={horseId}
            date={selected}
            exercise={form.exercise}
            complete={form.complete}
            done={form.done}
            categories={categories}
            intensities={intensities}
            onClose={() => setForm(null)}
        />
    );

    return (
        <div className="grid gap-4 lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-6">
            <div className="space-y-3">
                <MonthCalendar
                    month={month}
                    selected={selected}
                    onSelect={selectDay}
                    onMonthChange={changeMonth}
                    renderDay={(date) =>
                        exercises
                            .filter((exercise) => exercise.date === date)
                            .map((exercise) => (
                                <span
                                    key={exercise.id}
                                    data-color={exercise.category.value}
                                    className={cn(
                                        'size-2 rounded-full border-[1.5px] border-(--item-color)',
                                        exercise.done && 'bg-(--item-color)',
                                    )}
                                />
                            ))
                    }
                />

                <p className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-muted-foreground" />
                        elvégzett
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span
                            className="size-2 rounded-full border-[1.5px] border-muted-foreground"
                        />
                        tervezett
                    </span>
                </p>
            </div>

            {selected && selected.startsWith(month) && (
                <div className="space-y-3 rounded-xl border p-4">
                    <h4 className="font-semibold">
                        {format(parseISO(selected), 'yyyy. MMMM d., EEEE', { locale: hu })}
                    </h4>

                    {dayExercises.length === 0 && (
                        <p className="text-sm text-muted-foreground">Erre a napra nincs edzés.</p>
                    )}

                    <ul className="divide-y">
                        {dayExercises.map((exercise) => {
                            const planned = !exercise.done;
                            const missed = planned && exercise.date < today;

                            if (form?.exercise?.id === exercise.id) {
                                return (
                                    <li key={exercise.id} className="py-2">
                                        {exerciseForm}
                                    </li>
                                );
                            }

                            return (
                                <li key={exercise.id} className="flex items-start gap-3 py-2">
                                    <CategoryIcon kind="exercise" category={exercise.category} />
                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <p className="flex flex-wrap items-center gap-x-2">
                                            <span className="font-medium">{exercise.label}</span>
                                            {planned && (
                                                <span
                                                    className={
                                                        missed
                                                            ? 'text-xs text-amber-700'
                                                            : 'text-xs text-muted-foreground'
                                                    }
                                                >
                                                    {missed ? 'lejárt' : 'tervezett'}
                                                </span>
                                            )}
                                        </p>
                                        <p
                                            className="flex flex-wrap items-center gap-x-3 text-sm
                                                text-muted-foreground"
                                        >
                                            {exercise.time && (
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="size-3.5" />
                                                    <TimeBadge>{exercise.time}</TimeBadge>
                                                </span>
                                            )}
                                            {exercise.duration_minutes !== null && (
                                                <span>
                                                    {formatDuration(exercise.duration_minutes)}
                                                </span>
                                            )}
                                            {exercise.intensity && (
                                                <Badge
                                                    data-color={exercise.intensity.value}
                                                    className="bg-(--item-color) text-white"
                                                >
                                                    {exercise.intensity.label}
                                                </Badge>
                                            )}
                                        </p>
                                        {exercise.notes && (
                                            <p className="text-xs text-muted-foreground italic">
                                                {exercise.notes}
                                            </p>
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
                                                        setForm({
                                                            exercise,
                                                            complete: false,
                                                            done: exercise.done,
                                                        })
                                                    }
                                                >
                                                    <Pencil />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label="Törlés"
                                                    onClick={() => setRemoving(exercise)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                            {planned && exercise.date <= today && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() =>
                                                        setForm({
                                                            exercise,
                                                            complete: true,
                                                            done: false,
                                                        })
                                                    }
                                                >
                                                    <Check /> Kész
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {form && !form.exercise && exerciseForm}

                    {canEdit && (!form || form.exercise) && (
                        <div className="flex flex-wrap gap-2">
                            {selected <= today && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        setForm({ exercise: null, complete: false, done: true })
                                    }
                                >
                                    <Plus /> Edzés rögzítése
                                </Button>
                            )}
                            {selected >= today && (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                        setForm({ exercise: null, complete: false, done: false })
                                    }
                                >
                                    <CalendarPlus /> Edzés tervezése
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <DeleteDialog
                url={removing && route('horses.exercises.destroy', [horseId, removing.id])}
                message={`Biztosan törlöd ezt az edzést: ${removing?.label}?`}
                onClose={() => setRemoving(null)}
            />
        </div>
    );
}
