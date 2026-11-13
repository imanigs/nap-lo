import { Head, Form } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
    return (
        <Card className="m-4 max-w-md sm:mx-auto sm:my-8">
            <Head title="Elfelejtett jelszó" />
            <CardHeader>
                <CardTitle>Elfelejtett jelszó</CardTitle>
                <CardDescription className="text-foreground">
                    Add meg az email címed, és elküldjük a linket amellyel új jelszót állíthatsz be.
                </CardDescription>
            </CardHeader>

            <Form action={route('password.email')} method="post">
                {({ processing, errors }) => (
                    <>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel data-required htmlFor="email">
                                        Email cím
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        aria-invalid={!!errors.email}
                                        required
                                        autoFocus
                                    />
                                    {errors.email && <FieldError>{errors.email}</FieldError>}
                                </Field>
                            </FieldGroup>
                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={processing}>
                                Jelszó-visszaállító link küldése
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Form>
        </Card>
    );
}
