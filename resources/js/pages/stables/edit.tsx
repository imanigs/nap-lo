import { Head, usePage, Form } from '@inertiajs/react';
import { route } from 'ziggy-js';
import FormLabel from '@/components/custom/form-label';
import StableTabs from '@/components/custom/stable-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Stable } from '@/types/stable';

export default function Edit() {
    const { stable } = usePage<{ stable: Stable }>().props;

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Istálló szerkesztése" />
            <StableTabs stable={stable} active="edit" />

            <Card>
                <CardHeader>
                    <CardTitle>Istálló szerkesztése</CardTitle>
                </CardHeader>

                <Form action={route('stables.update', stable.id)} method="patch">
                    {({ processing, errors }) => (
                        <>
                            <CardContent className="space-y-4">
                                <Field>
                                    <FormLabel htmlFor="name" data-required className="text-sm">
                                        Név
                                    </FormLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={stable.name}
                                        disabled={processing}
                                        required
                                        autoFocus
                                    />
                                    {errors.name && <FieldError>{errors.name}</FieldError>}
                                </Field>
                            </CardContent>

                            <CardFooter className="flex justify-end">
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
