import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { TriangleAlert, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import AdLibToggle from '@/components/custom/ad-lib-toggle';
import CategorySelector from '@/components/custom/category-selector';
import DateRange from '@/components/custom/date-range';
import DayBar from '@/components/custom/day-bar';
import FormLabel from '@/components/custom/form-label';
import TimeList from '@/components/custom/time-list';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import type { FeedCategoryOption, FeedRoutine, FeedUnitOption } from '@/types/feed';

interface FeedCardFormProps {
    horseId: number;
    routine: FeedRoutine | null;
    categories: FeedCategoryOption[];
    units: FeedUnitOption[];
    onClose: () => void;
}

export default function FeedCardForm({
    horseId,
    routine,
    categories,
    units,
    onClose,
}: FeedCardFormProps) {
    const defaultUnit = units.find((unit) => unit.value === 'kg') ?? units[0];

    const { data, setData, post, put, processing, errors } = useForm({
        label: routine?.label ?? '',
        category: routine?.category.value ?? categories[0].value,
        is_ad_lib: routine?.is_ad_lib ?? false,
        quantity: routine?.quantity?.toString() ?? '',
        unit: routine?.unit?.value ?? defaultUnit.value,
        days_of_week: routine?.days_of_week ?? [1, 2, 3, 4, 5, 6, 7],
        times_of_day: routine?.times_of_day ?? ['08:00'],
        starts_at: routine?.starts_at ?? format(new Date(), 'yyyy-MM-dd'),
        ends_at: routine?.ends_at ?? '',
        notes: routine?.notes ?? '',
    });

    const listError = (field: 'times_of_day' | 'days_of_week') => {
        if (errors[field]) {
            return errors[field];
        }

        for (const [name, message] of Object.entries(errors)) {
            if (name.startsWith(`${field}.`)) {
                return message;
            }
        }

        return undefined;
    };

    const timesError = listError('times_of_day');
    const daysError = listError('days_of_week');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: onClose };

        if (routine) {
            put(route('horses.feed-routines.update', [horseId, routine.id]), options);
        } else {
            post(route('horses.feed-routines.store', horseId), options);
        }
    };

    return (
        <form
            data-color={data.category}
            onSubmit={submit}
            className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm
                sm:col-span-2"
        >
            <header
                className="flex items-center justify-between gap-2 bg-(--item-color) py-1 pr-1 pl-3
                    text-white transition-colors"
            >
                <h3 className="font-semibold">{routine ? 'Rutin szerkesztése' : 'Új rutin'}</h3>
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

            <div className="space-y-5 p-4">
                {routine && (
                    <div
                        className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5
                            text-xs text-amber-900"
                    >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>
                            A módosítás az előzményeket is átírja. Ha a ló etetése változott, hozz
                            létre egy új bejegyzést.
                        </p>
                    </div>
                )}

                <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                    <div className="space-y-4">
                        <Field>
                            <FormLabel data-required htmlFor="feed_label">
                                Megnevezés
                            </FormLabel>
                            <Input
                                id="feed_label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="pl.: Zab"
                                disabled={processing}
                                required
                                autoFocus
                            />
                            {errors.label && <FieldError>{errors.label}</FieldError>}
                        </Field>

                        <Field className="sm:col-span-2">
                            <FormLabel data-required>Kategória</FormLabel>
                            <CategorySelector
                                kind="feed"
                                options={categories}
                                value={data.category}
                                onChange={(value) => setData('category', value)}
                                disabled={processing}
                            />
                            {errors.category && <FieldError>{errors.category}</FieldError>}
                        </Field>

                        <AdLibToggle
                            value={data.is_ad_lib}
                            onChange={(value) => setData('is_ad_lib', value)}
                            disabled={processing}
                        />

                        {!data.is_ad_lib && (
                            <Field>
                                <FormLabel data-required htmlFor="feed_quantity">
                                    Mennyiség egyszerre
                                </FormLabel>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="feed_quantity"
                                        type="number"
                                        inputMode="decimal"
                                        min="0.01"
                                        step="0.01"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        placeholder="0"
                                        className="w-28"
                                        disabled={processing}
                                    />
                                    <NativeSelect
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        aria-label="Mértékegység"
                                        disabled={processing}
                                    >
                                        {units.map((unit) => (
                                            <NativeSelectOption key={unit.value} value={unit.value}>
                                                {unit.label}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                    <span className="text-sm whitespace-nowrap">
                                        napi {data.times_of_day.length}x
                                    </span>
                                </div>
                                {errors.quantity && <FieldError>{errors.quantity}</FieldError>}
                                {errors.unit && <FieldError>{errors.unit}</FieldError>}
                            </Field>
                        )}
                    </div>

                    <div className="space-y-4">
                        {!data.is_ad_lib && (
                            <>
                                <Field>
                                    <FormLabel data-required>Időpontok</FormLabel>
                                    <TimeList
                                        value={data.times_of_day}
                                        onChange={(value) => setData('times_of_day', value)}
                                        disabled={processing}
                                    />
                                    {timesError && <FieldError>{timesError}</FieldError>}
                                </Field>

                                <Field>
                                    <FormLabel data-required>Napok</FormLabel>
                                    <DayBar
                                        value={data.days_of_week}
                                        onChange={(days) => setData('days_of_week', days)}
                                        disabled={processing}
                                    />
                                    {daysError && <FieldError>{daysError}</FieldError>}
                                </Field>
                            </>
                        )}

                        <Field>
                            <FormLabel data-required htmlFor="feed_starts_at">
                                Ettől eddig
                            </FormLabel>
                            <DateRange
                                startsAt={data.starts_at}
                                endsAt={data.ends_at}
                                onStartsAtChange={(value) => setData('starts_at', value)}
                                onEndsAtChange={(value) => setData('ends_at', value)}
                                startsAtId="feed_starts_at"
                                endsAtId="feed_ends_at"
                                startsAtError={errors.starts_at}
                                endsAtError={errors.ends_at}
                                disabled={processing}
                            />
                        </Field>
                    </div>
                </div>

                <Field>
                    <FormLabel htmlFor="feed_notes">Megjegyzés</FormLabel>
                    <Textarea
                        id="feed_notes"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        placeholder="Bármi egyéb amit szeretnél megjegyezni..."
                        className="min-h-14"
                        maxLength={100}
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
