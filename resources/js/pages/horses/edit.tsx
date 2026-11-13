import { Head, usePage, Link, Form } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import DatePicker from '@/components/custom/date-picker';
import FormLabel from '@/components/custom/form-label';
import HorseTabs from '@/components/custom/horse-tabs';
import { PhotoUpload } from '@/components/custom/photo-upload';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import type { GenderOption, Horse } from '@/types/horse';

export default function Edit() {
    const { horse, gender, abilities, genders } = usePage<{
        horse: Horse;
        gender: string;
        abilities: string[];
        genders: GenderOption[];
    }>().props;
    const [birthDate, setBirthDate] = useState(horse.birth_date ?? '');

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Ló szerkesztése" />
            <HorseTabs horse={horse} abilities={abilities} active="edit" />

            <Card>
                <CardHeader>
                    <CardTitle>Ló szerkesztése</CardTitle>
                </CardHeader>

                <Form
                    action={route('horses.update', horse.id)}
                    method="post"
                    encType="multipart/form-data"
                >
                    {({ processing, errors }) => (
                        <>
                            <CardContent className="space-y-4">
                                <input type="hidden" name="_method" value="patch" />

                                <PhotoUpload
                                    name="picture"
                                    defaultValue={horse.picture}
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
                                        defaultValue={horse.name ?? undefined}
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
                                        defaultValue={gender}
                                        className="w-full"
                                        required
                                        disabled={processing}
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
                                        <Input
                                            id="breed"
                                            name="breed"
                                            defaultValue={horse.breed ?? undefined}
                                            disabled={processing}
                                        />
                                        {errors.breed && <FieldError>{errors.breed}</FieldError>}
                                    </Field>
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="status">Státusz</FieldLabel>
                                    <Input
                                        id="status"
                                        name="status"
                                        defaultValue={horse.status ?? undefined}
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
                                        defaultValue={horse.notes ?? undefined}
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
                                    href={route('horses.show', horse.id)}
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
