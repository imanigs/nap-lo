import { Head, Form, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Login() {
    return (
        <Card className="m-4 max-w-md sm:mx-auto sm:my-8">
            <Head title="Belépés" />
            <CardHeader>
                <CardTitle>Belépés</CardTitle>
            </CardHeader>

            <Form action={route('login')} method="post">
                {({ processing, errors }) => (
                    <>
                        <CardContent>
                            <FieldGroup>
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
                                        autoFocus
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
                                        autoComplete="current-password"
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field orientation="horizontal">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        value="1"
                                        defaultChecked
                                    />
                                    <FieldLabel htmlFor="remember">Emlékezz rám</FieldLabel>
                                    <Link
                                        href={route('password.request')}
                                        className={buttonVariants({
                                            variant: 'outline',
                                            size: 'sm',
                                        })}
                                    >
                                        Elfelejtett jelszó
                                    </Link>
                                </Field>
                            </FieldGroup>
                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={processing}>
                                Belépés
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Form>
        </Card>
    );
}
