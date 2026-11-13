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

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <Card className="m-4 max-w-md sm:mx-auto sm:my-8">
            <Head title="Új jelszó" />
            <CardHeader>
                <CardTitle>Új jelszó megadása</CardTitle>
                <CardDescription className="text-foreground">
                    Hozz létre új jelszót a fiókod visszaállításához.
                </CardDescription>
            </CardHeader>

            <Form action={route('password.update')} method="post">
                {({ processing, errors }) => (
                    <>
                        <CardContent>
                            <FieldGroup>
                                <input type="hidden" name="token" value={token} />
                                <input type="hidden" name="email" value={email} />

                                <Field>
                                    <FieldLabel data-required htmlFor="password">
                                        Új jelszó
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password}
                                        required
                                        autoFocus
                                    />
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="password_confirmation">
                                        Új jelszó megerősítése
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
                                Jelszó visszaállítása
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Form>
        </Card>
    );
}
