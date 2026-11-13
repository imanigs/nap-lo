import { Head, Link, Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import DatePicker from '@/components/custom/date-picker';
import FormLabel from '@/components/custom/form-label';
import { PhotoUpload } from '@/components/custom/photo-upload';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import type { GenderOption } from '@/types/horse';

export default function Create() {
    const { genders } = usePage<{ genders: GenderOption[] }>().props;
    const [birthDate, setBirthDate] = useState('');

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Új ló" />
            <Card>
                <CardHeader>
                    <CardTitle>Új ló hozzáadása</CardTitle>
                </CardHeader>

                <Form action={route('horses.store')} method="post" encType="multipart/form-data">
                    {({ processing, errors }) => (
                        <>
                            <CardContent className="space-y-4">
                                <PhotoUpload
                                    name="picture"
                                    error={errors.picture}
                                    disabled={processing}
                                />

                                <Field>
                                    <FormLabel htmlFor="name" data-required className="text-sm">
                                        Név
                                    </FormLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        disabled={processing}
                                        required
                                        autoFocus
                                    />
                                    {errors.name && <FieldError>{errors.name}</FieldError>}
                                </Field>

                                <Field>
                                    <FormLabel htmlFor="gender" data-required className="text-sm">
                                        Nem
                                    </FormLabel>
                                    <NativeSelect
                                        id="gender"
                                        name="gender"
                                        className="w-full"
                                        required
                                        disabled={processing}
                                        defaultValue=""
                                    >
                                        <NativeSelectOption value="" disabled hidden>
                                            Válassz nemet...
                                        </NativeSelectOption>
                                        {genders.map((option) => (
                                            <NativeSelectOption
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                    {errors.gender && <FieldError>{errors.gender}</FieldError>}
                                </Field>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field>
                                        <DatePicker
                                            id="birth_date"
                                            name="birth_date"
                                            label="Születési dátum"
                                            value={birthDate}
                                            onChange={setBirthDate}
                                            error={errors.birth_date}
                                            disabled={processing}
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="breed">Fajta</FieldLabel>
                                        <Input id="breed" name="breed" disabled={processing} />
                                        {errors.breed && <FieldError>{errors.breed}</FieldError>}
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="status">Státusz</FieldLabel>
                                    <Input
                                        id="status"
                                        name="status"
                                        placeholder="pl.: Aktív, Pihenőn"
                                        disabled={processing}
                                    />
                                    {errors.status && <FieldError>{errors.status}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="notes">Megjegyzések</FieldLabel>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        className="min-h-20"
                                        placeholder="Bármi egyéb amit szeretnél megjegyezni..."
                                        maxLength={5000}
                                        disabled={processing}
                                    />
                                    {errors.notes && <FieldError>{errors.notes}</FieldError>}
                                </Field>
                            </CardContent>

                            <CardFooter className="flex justify-end gap-3">
                                <Link
                                    href={route('horses.index')}
                                    className={buttonVariants({ variant: 'outline' })}
                                >
                                    Vissza
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Mentés
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Form>
            </Card>
        </div>
    );
}
