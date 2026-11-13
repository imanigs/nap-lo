import { Head, Form, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { EditableField } from '@/components/custom/editable-field';
import SettingsTabs from '@/components/custom/settings-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Profile() {
    const { auth } = usePage().props;
    const user = auth.user!;

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-8">
            <Head title="Beállítások" />
            <SettingsTabs active="account" />

            <Card>
                <CardHeader>
                    <CardTitle>Személyes adatok</CardTitle>
                </CardHeader>

                <CardContent className="space-y-0">
                    <EditableField
                        label="Vezetéknév"
                        dbField="last_name"
                        initialValue={user.last_name}
                        actionUrl={route('settings.update')}
                    />
                    <EditableField
                        label="Keresztnév"
                        dbField="first_name"
                        initialValue={user.first_name}
                        actionUrl={route('settings.update')}
                    />
                    <EditableField
                        label="Email cím"
                        dbField="email"
                        initialValue={user.email}
                        type="email"
                        actionUrl={route('settings.update')}
                    />
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Értesítések</CardTitle>
                </CardHeader>

                <CardContent>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <Checkbox
                            checked={user.email_notifications}
                            onCheckedChange={(checked) =>
                                router.patch(
                                    route('settings.update'),
                                    { email_notifications: checked === true },
                                    { preserveScroll: true },
                                )
                            }
                        />
                        Emailben is kérem az értesítéseket
                    </label>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Jelszó módosítása</CardTitle>
                </CardHeader>

                <CardContent>
                    <Form
                        action={route('settings.password.update')}
                        method="put"
                        resetOnSuccess
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <Field>
                                    <FieldLabel data-required htmlFor="current_password">
                                        Jelenlegi jelszó
                                    </FieldLabel>
                                    <Input
                                        id="current_password"
                                        name="current_password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={!!errors.current_password}
                                        required
                                    />
                                    {errors.current_password && (
                                        <FieldError>{errors.current_password}</FieldError>
                                    )}
                                </Field>

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
                                    />
                                    {errors.password && <FieldError>{errors.password}</FieldError>}
                                </Field>

                                <Field>
                                    <FieldLabel data-required htmlFor="password_confirmation">
                                        Új jelszó újra
                                    </FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                    />
                                </Field>

                                <Button type="submit" disabled={processing}>
                                    Jelszó módosítása
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Fiók törlése</CardTitle>
                    <CardDescription className="text-foreground">
                        A fiókod és a hozzá tartozó istálló véglegesen törlődik. A megosztásaid
                        megszűnnek. A fiók nem törölhető, amíg vannak lovaid.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form
                        action={route('settings.destroy')}
                        method="delete"
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <Field>
                                    <FieldLabel data-required htmlFor="delete_password">
                                        Jelszó
                                    </FieldLabel>
                                    <Input
                                        id="delete_password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    {errors.password && (
                                        <FieldError>{errors.password}</FieldError>
                                    )}
                                </Field>

                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    Fiók törlése
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
