import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import DeleteDialog from '@/components/custom/delete-dialog';
import HorseTabs from '@/components/custom/horse-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Horse } from '@/types/horse';

export default function Settings() {
    const { horse, abilities } = usePage<{
        horse: Horse;
        abilities: string[];
    }>().props;
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Ló beállításai" />
            <HorseTabs horse={horse} abilities={abilities} active="settings" />

            <Card>
                <CardHeader>
                    <CardTitle>Beállítások</CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        A ló törlése után az adatai többé nem lesznek elérhetők.
                    </p>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Ló törlése
                    </Button>
                </CardContent>
            </Card>

            <DeleteDialog
                url={confirmOpen ? route('horses.destroy', horse.id) : null}
                message="Biztosan törölni akarod a lovat?"
                onClose={() => setConfirmOpen(false)}
                cancelLabel="Nem"
                confirmLabel="Igen"
            />
        </div>
    );
}
