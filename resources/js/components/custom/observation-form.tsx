import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarDays,
    HeartPulse,
    Ruler,
    Trophy,
    TriangleAlert,
    Weight,
    X,
    Zap,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import BodyConditionTable from '@/components/custom/body-condition-table';
import DatePicker from '@/components/custom/date-picker';
import FormLabel from '@/components/custom/form-label';
import RatingScale from '@/components/custom/rating-scale';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ObservationRatings, Observation } from '@/types/observation';

interface ObservationFormProps {
    horseId: number;
    record: Observation | null;
    ratings: ObservationRatings;
    onClose: () => void;
}

export default function ObservationForm({
    horseId,
    record,
    ratings,
    onClose,
}: ObservationFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        date: record?.date ?? format(new Date(), 'yyyy-MM-dd'),
        height_cm: record?.height_cm?.toString() ?? '',
        weight_kg: record?.weight_kg?.toString() ?? '',
        health_rating: record?.health_rating?.value.toString() ?? '',
        disposition_rating: record?.disposition_rating?.value.toString() ?? '',
        performance_rating: record?.performance_rating?.value.toString() ?? '',
        bcs_rating: record?.bcs_rating?.value.toString() ?? '',
        notes: record?.notes ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: onClose };

        if (record) {
            put(route('horses.observations.update', [horseId, record.id]), options);
        } else {
            post(route('horses.observations.store', horseId), options);
        }
    };

    return (
        <form
            onSubmit={submit}
            className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm
                sm:col-span-2"
        >
            <header
                className="flex items-center justify-between gap-2 bg-main py-1 pr-1 pl-3
                    text-white"
            >
                <h3 className="truncate font-semibold">
                    {record ? 'Megfigyelés szerkesztése' : 'Megfigyelés rögzítése'}
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
                {record && (
                    <div
                        className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5
                            text-xs text-amber-900"
                    >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>A módosítás átírja az előzményeket.</p>
                    </div>
                )}

                <Field>
                    <FormLabel
                        data-required
                        htmlFor="observation_date"
                        className="flex items-center gap-1.5 text-sm"
                    >
                        <CalendarDays className="size-4" />
                        Dátum
                    </FormLabel>
                    <DatePicker
                        id="observation_date"
                        value={data.date}
                        onChange={(value) => setData('date', value)}
                        error={errors.date}
                        disabled={processing}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FormLabel
                            htmlFor="observation_height"
                            className="flex items-center gap-1.5 text-sm"
                        >
                            <Ruler className="size-4" />
                            Magasság (cm)
                        </FormLabel>
                        <Input
                            id="observation_height"
                            type="number"
                            inputMode="numeric"
                            min="20"
                            max="250"
                            step="1"
                            value={data.height_cm}
                            onChange={(e) => setData('height_cm', e.target.value)}
                            disabled={processing}
                        />
                        {errors.height_cm && <FieldError>{errors.height_cm}</FieldError>}
                    </Field>

                    <Field>
                        <FormLabel
                            htmlFor="observation_weight"
                            className="flex items-center gap-1.5 text-sm"
                        >
                            <Weight className="size-4" />
                            Testsúly (kg)
                        </FormLabel>
                        <Input
                            id="observation_weight"
                            type="number"
                            inputMode="numeric"
                            min="20"
                            max="2000"
                            step="1"
                            value={data.weight_kg}
                            onChange={(e) => setData('weight_kg', e.target.value)}
                            disabled={processing}
                        />
                        {errors.weight_kg && <FieldError>{errors.weight_kg}</FieldError>}
                    </Field>
                </div>

                <div>
                    <RatingScale
                        label="Egészségi állapot"
                        scale="health"
                        icon={HeartPulse}
                        options={ratings.health_rating}
                        value={data.health_rating}
                        onChange={(value) => setData('health_rating', value)}
                        disabled={processing}
                    />
                    {errors.health_rating && <FieldError>{errors.health_rating}</FieldError>}
                </div>

                <div>
                    <RatingScale
                        label="Teljesítmény"
                        scale="performance"
                        icon={Trophy}
                        options={ratings.performance_rating}
                        value={data.performance_rating}
                        onChange={(value) => setData('performance_rating', value)}
                        disabled={processing}
                    />
                    {errors.performance_rating && (
                        <FieldError>{errors.performance_rating}</FieldError>
                    )}
                </div>

                <div>
                    <RatingScale
                        label="Temperamentum"
                        scale="disposition"
                        icon={Zap}
                        options={ratings.disposition_rating}
                        value={data.disposition_rating}
                        onChange={(value) => setData('disposition_rating', value)}
                        disabled={processing}
                    />
                    {errors.disposition_rating && (
                        <FieldError>{errors.disposition_rating}</FieldError>
                    )}
                </div>

                <div>
                    <BodyConditionTable
                        options={ratings.bcs_rating}
                        value={data.bcs_rating}
                        onChange={(value) => setData('bcs_rating', value)}
                        disabled={processing}
                    />
                    {errors.bcs_rating && <FieldError>{errors.bcs_rating}</FieldError>}
                </div>

                <Field>
                    <FormLabel
                        htmlFor="observation_notes"
                        className="flex items-center gap-1.5 text-sm"
                    >
                        Megjegyzés
                    </FormLabel>
                    <Textarea
                        id="observation_notes"
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
