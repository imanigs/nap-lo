import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import { MEASUREMENT_FIELDS } from '@/components/custom/horse-measurements';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Measurement } from '@/types/measurement';

interface MeasurementFormProps {
    horseId: number;
    measurement: Measurement;
}

export default function MeasurementForm({ horseId, measurement }: MeasurementFormProps) {
    const { data, setData, put, processing, errors } = useForm({
        girth_size: measurement.girth_size ?? '',
        bit_size: measurement.bit_size ?? '',
        blanket_size: measurement.blanket_size ?? '',
        bridle_size: measurement.bridle_size ?? '',
        saddle_size: measurement.saddle_size ?? '',
        feet_size: measurement.feet_size ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('horses.measurement.update', horseId), { preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Méretek</CardTitle>
            </CardHeader>

            <form onSubmit={submit}>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    {MEASUREMENT_FIELDS.map((field) => (
                        <Field key={field.name}>
                            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                            <Input
                                id={field.name}
                                value={data[field.name]}
                                onChange={(e) => setData(field.name, e.target.value)}
                                maxLength={32}
                                disabled={processing}
                            />
                            {errors[field.name] && <FieldError>{errors[field.name]}</FieldError>}
                        </Field>
                    ))}
                </CardContent>

                <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={processing}>
                        Mentés
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
