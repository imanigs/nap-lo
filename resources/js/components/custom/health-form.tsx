import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { TriangleAlert, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import CategorySelector from '@/components/custom/category-selector';
import DatePicker from '@/components/custom/date-picker';
import FormLabel from '@/components/custom/form-label';
import ReminderSelect from '@/components/custom/reminder-select';
import TimeInput from '@/components/custom/time-input';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import type { HealthCategoryOption, HealthRecord, HealthRepeatUnitOption } from '@/types/health';

interface HealthFormProps {
    horseId: number;
    record: HealthRecord | null;
    complete: boolean;
    done: boolean;
    categories: HealthCategoryOption[];
    repeatUnits: HealthRepeatUnitOption[];
    onClose: () => void;
}

export default function HealthForm({
    horseId,
    record,
    complete,
    done,
    categories,
    repeatUnits,
    onClose,
}: HealthFormProps) {
    let title = done ? 'Bejegyzés rögzítése' : 'Bejegyzés tervezése';

    if (record) {
        title = complete ? `Kész: ${record.label}` : 'Bejegyzés szerkesztése';
    }

    const { data, setData, post, put, transform, processing, errors } = useForm({
        label: record?.label ?? '',
        category: record?.category.value ?? categories[0].value,
        done: record?.done ?? done,
        date: record && !complete ? record.date : format(new Date(), 'yyyy-MM-dd'),
        time: record?.time ?? '',
        repeat_every: record?.repeat_every?.toString() ?? '',
        repeat_unit: record?.repeat_unit?.value ?? repeatUnits[0].value,
        notes: record?.notes ?? '',
        remind_before: record?.remind_before?.toString() ?? '',
    });

    transform((fields) => ({
        ...fields,
        repeat_unit: fields.repeat_every === '' ? '' : fields.repeat_unit,
    }));

    let showReminder = !data.done || (!record && data.repeat_every !== '');

    if (complete) {
        showReminder = !!record?.repeat_every;
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = { preserveScroll: true, onSuccess: onClose };

        if (record && complete) {
            post(route('horses.health-records.complete', [horseId, record.id]), options);
        } else if (record) {
            put(route('horses.health-records.update', [horseId, record.id]), options);
        } else {
            post(route('horses.health-records.store', horseId), options);
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
                <h3 className="truncate font-semibold">{title}</h3>
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
                {record?.done && !complete && (
                    <div
                        className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5
                            text-xs text-amber-900"
                    >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>Ez egy korábbi bejegyzés, a módosítás az előzményeket is átírja.</p>
                    </div>
                )}

                {!complete && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FormLabel data-required htmlFor="health_label">
                                Megnevezés
                            </FormLabel>
                            <Input
                                id="health_label"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                placeholder="pl.: Patkolás"
                                disabled={processing}
                                required
                                autoFocus
                            />
                            {errors.label && <FieldError>{errors.label}</FieldError>}
                        </Field>

                        <Field className="sm:col-span-2">
                            <FormLabel data-required>Kategória</FormLabel>
                            <CategorySelector
                                kind="health"
                                options={categories}
                                value={data.category}
                                onChange={(value) => setData('category', value)}
                                disabled={processing}
                            />
                            {errors.category && <FieldError>{errors.category}</FieldError>}
                        </Field>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                        <FormLabel data-required htmlFor="health_date">
                            {complete ? 'Mikor történt' : 'Dátum'}
                        </FormLabel>
                        <DatePicker
                            id="health_date"
                            value={data.date}
                            onChange={(value) => setData('date', value)}
                            error={errors.date}
                            disabled={processing}
                        />
                        {errors.done && <FieldError>{errors.done}</FieldError>}
                    </Field>

                    <Field>
                        <FormLabel>Időpont</FormLabel>
                        <TimeInput
                            value={data.time}
                            onChange={(value) => setData('time', value)}
                            disabled={processing}
                        />
                        {errors.time && <FieldError>{errors.time}</FieldError>}
                    </Field>
                </div>

                {record && complete && data.date !== record.date && (
                    <div
                        className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-2.5
                            text-xs text-amber-900"
                    >
                        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>
                            Ez nem a tervezett nap ({record.date}), a bejegyzés
                            dátuma {data.date} lesz.
                            {record.repeat_every &&
                                ' A következő bejegyzés a mai naptól számolódik.'}
                        </p>
                    </div>
                )}

                {!complete && (
                    <Field>
                        <FormLabel htmlFor="health_repeat">Ismétlődik (nem kötelező)</FormLabel>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">minden</span>
                            <Input
                                id="health_repeat"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                max="365"
                                step="1"
                                value={data.repeat_every}
                                onChange={(e) => setData('repeat_every', e.target.value)}
                                className="w-20"
                                disabled={processing}
                            />
                            <NativeSelect
                                value={data.repeat_unit}
                                onChange={(e) => setData('repeat_unit', e.target.value)}
                                aria-label="Ismétlés egysége"
                                disabled={processing}
                            >
                                {repeatUnits.map((unit) => (
                                    <NativeSelectOption key={unit.value} value={unit.value}>
                                        {unit.label}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>
                        {errors.repeat_every && <FieldError>{errors.repeat_every}</FieldError>}
                        {errors.repeat_unit && <FieldError>{errors.repeat_unit}</FieldError>}
                    </Field>
                )}

                {showReminder && (
                    <ReminderSelect
                        id="health_remind"
                        value={data.remind_before}
                        onChange={(value) => setData('remind_before', value)}
                        error={errors.remind_before}
                        disabled={processing}
                    />
                )}

                <Field>
                    <FormLabel htmlFor="health_notes">Megjegyzés</FormLabel>
                    <Textarea
                        id="health_notes"
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
