import { Head, Form, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { EditableField } from '@/components/custom/editable-field';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

export default function VerifyEmail() {
    const { auth } = usePage().props;

    return (
        <Card className="m-4 max-w-md sm:mx-auto sm:my-8">
            <Head title="Email megerősítése" />
            <CardHeader>
                <CardTitle>Erősítsd meg az email címed</CardTitle>
                <CardDescription className="text-foreground">
                    Igazold vissza az email címed a linkre kattintva, amit most küldtünk el neked.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <EditableField
                    label="Email cím"
                    dbField="email"
                    initialValue={auth.user!.email}
                    type="email"
                    actionUrl={route('settings.update')}
                />
            </CardContent>
            <Form action={route('verification.send')} method="post">
                {({ processing }) => (
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={processing}>
                            Megerősítő email újraküldése
                        </Button>
                    </CardFooter>
                )}
            </Form>
        </Card>
    );
}
