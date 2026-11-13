import { Head, Form } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Register() {
    return (
        <Card className="m-4 max-w-md sm:mx-auto sm:my-8">
            <Head title="Regisztráció" />
            <CardHeader>
                <CardTitle>Regisztráció</CardTitle>
            </CardHeader>

            <Form action={route('register')} method="post">
                {({ processing, errors }) => (
                    <>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel data-required htmlFor="first_name">
                                        Keresztnév
                                    </FieldLabel>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        autoComplete="given-name"
                                        aria-invalid={!!errors.first_name}
                                        required
                                        autoFocus
                                    />
                                    {errors.first_name && (
                                        <FieldError>{errors.first_name}</FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="last_name">
                                        Vezetéknév
                                    </FieldLabel>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        autoComplete="family-name"
                                        aria-invalid={!!errors.last_name}
                                        required
                                    />
                                    {errors.last_name && (
                                        <FieldError>{errors.last_name}</FieldError>
                                    )}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        aria-invalid={!!errors.email}
                                        required
                                    />
                                    {errors.email && <FieldError>{errors.email}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="password">
                                        Jelszó
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="password_confirmation">
                                        Jelszó ismétlése
                                    </FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password_confirmation}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <FieldError>{errors.password_confirmation}</FieldError>
                                    )}
                                </Field>
                            </FieldGroup>
                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={processing}>
                                Regisztráció
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Form>
        </Card>
    );
}
