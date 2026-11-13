import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import CategorySelector from '@/components/custom/category-selector';
import DatePicker from '@/components/custom/date-picker';
import FormLabel from '@/components/custom/form-label';
import IntensitySelect from '@/components/custom/intensity-select';
import TimeInput from '@/components/custom/time-input';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Exercise, ExerciseCategoryOption, ExerciseIntensityOption } from '@/types/exercise';

interface ExerciseFormProps {
    horseId: number;
    date: string;
    exercise: Exercise | null;
    complete: boolean;
    done: boolean;
    categories: ExerciseCategoryOption[];
    intensities: ExerciseIntensityOption[];
    onClose: () => void;
}

export default function ExerciseForm({
    horseId,
    date,
    exercise,
    complete,
    done,
    categories,
    intensities,
    onClose,
}: ExerciseFormProps) {
    let title = done ? 'Edzés rögzítése' : 'Edzés tervezése';

    if (exercise) {
        title = complete ? `Kész: ${exercise.label}` : 'Edzés szerkesztése';
    }

    const { data, setData, post, put, processing, errors } = useForm({
        label: exercise?.label ?? '',
        category: exercise?.category.value ?? categories[0].value,
        done,
        date: exercise?.date ?? date,
        time: exercise?.time ?? '',
        duration_minutes: exercise?.duration_minutes?.toString() ?? '',
        intensity: exercise?.intensity?.value ?? '',
        notes: exercise?.notes ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: onClose };

        if (exercise && complete) {
            post(route('horses.exercises.complete', [horseId, exercise.id]), options);
        } else if (exercise) {
            put(route('horses.exercises.update', [horseId, exercise.id]), options);
        } else {
            post(route('horses.exercises.store', horseId), options);
        }
    };

    return (
        <form
            data-color={data.category}
            onSubmit={submit}
            className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
        >
            <header
                className="flex items-center justify-between gap-2 bg-(--item-color) py-1 pr-1 pl-3
                    text-white transition-colors"
            >
                <h3 className="truncate font-semibold">
                    {title} <span className="font-normal opacity-80">| {data.date}</span>
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Bezárás"
                    onClick={onClose}
                    disabled={processing}
                    className="text-white hover:bg-white/20 hover:text-white"
                >
                    <X />
                </Button>
            </header>

            <div className="space-y-4 p-4">
                {!complete && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FormLabel data-required htmlFor="exercise_label">
                                Megnevezés
                            </FormLabel>
                            <Input
                                id="exercise_label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="pl.: Futószárazás"
                                disabled={processing}
                                required
                                autoFocus
                            />
                            {errors.label && <FieldError>{errors.label}</FieldError>}
                        </Field>

                        <Field className="sm:col-span-2">
                            <FormLabel data-required>Kategória</FormLabel>
                            <CategorySelector
                                kind="exercise"
                                options={categories}
                                value={data.category}
                                onChange={(value) => setData('category', value)}
                                disabled={processing}
                            />
                            {errors.category && <FieldError>{errors.category}</FieldError>}
                        </Field>
                    </div>
                )}

                {exercise && !complete && (
                    <Field>
                        <FormLabel data-required htmlFor="exercise_date">
                            Dátum
                        </FormLabel>
                        <DatePicker
                            id="exercise_date"
                            value={data.date}
                            onChange={(value) => setData('date', value)}
                            disabled={processing}
                        />
                    </Field>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                        <FormLabel>Időpont</FormLabel>
                        <TimeInput
                            value={data.time}
                            onChange={(value) => setData('time', value)}
                            disabled={processing}
                        />
                        {errors.time && <FieldError>{errors.time}</FieldError>}
                        {errors.date && <FieldError>{errors.date}</FieldError>}
                        {errors.done && <FieldError>{errors.done}</FieldError>}
                    </Field>

                    <Field>
                        <FormLabel htmlFor="exercise_duration">Időtartam (perc)</FormLabel>
                        <Input
                            id="exercise_duration"
                            type="number"
                            inputMode="numeric"
                            min="1"
                            max="1440"
                            step="1"
                            value={data.duration_minutes}
                            onChange={(e) => setData('duration_minutes', e.target.value)}
                            className="w-36"
                            disabled={processing}
                        />
                        {errors.duration_minutes && (
                            <FieldError>{errors.duration_minutes}</FieldError>
                        )}
                    </Field>
                </div>

                <Field>
                    <FormLabel>Intenzitás</FormLabel>
                    <IntensitySelect
                        options={intensities}
                        value={data.intensity}
                        onChange={(value) => setData('intensity', value)}
                        disabled={processing}
                    />
                    {errors.intensity && <FieldError>{errors.intensity}</FieldError>}
                </Field>

                <Field>
                    <FormLabel htmlFor="exercise_notes">Megjegyzés</FormLabel>
                    <Textarea
                        id="exercise_notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Bármi egyéb amit szeretnél megjegyezni..."
                        className="min-h-14"
                        maxLength={255}
                        disabled={processing}
                    />
                    {errors.notes && <FieldError>{errors.notes}</FieldError>}
                </Field>

                <div className="flex justify-end gap-2 border-t pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                        Mégse
                    </Button>
                    <Button type="submit" disabled={processing}>
                        Mentés
                    </Button>
                </div>
            </div>
        </form>
    );
}
