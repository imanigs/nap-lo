import { Head, Link, usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import DeleteDialog from '@/components/custom/delete-dialog';
import RoleSelect, { roleLabel } from '@/components/custom/role-select';
import SettingsTabs from '@/components/custom/settings-tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { SharedByUser, SharedWithUser } from '@/types/share';

interface ShareGroup extends SharedByUser {
    label: string;
    field: 'horse_role' | 'stable_role';
    resource: 'horses' | 'stables';
}

interface Removal {
    url: string;
    message: string;
}

export default function Shares() {
    const { sharedWithUser, sharedByUser } = usePage<{
        sharedWithUser: { horses: SharedWithUser[]; stables: SharedWithUser[] };
        sharedByUser: { horses: SharedByUser[]; stable: SharedByUser };
    }>().props;
    const [removing, setRemoving] = useState<Removal | null>(null);

    const withUser = [
        ...sharedWithUser.stables.map((item) => ({
            ...item,
            kind: 'Istálló',
            href: null,
            leave: route('settings.shares.leave-stable', item.id),
        })),
        ...sharedWithUser.horses.map((item) => ({
            ...item,
            kind: 'Ló',
            href: route('horses.show', item.id),
            leave: route('settings.shares.leave-horse', item.id),
        })),
    ];

    const { horses, stable } = sharedByUser;
    const byUser: ShareGroup[] = [];

    if (stable.shares.length > 0) {
        byUser.push({ ...stable, label: 'Istálló', field: 'stable_role', resource: 'stables' });
    }

    horses.forEach((horse) => {
        byUser.push({ ...horse, label: 'Ló', field: 'horse_role', resource: 'horses' });
    });

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-8">
            <Head title="Megosztások" />
            <SettingsTabs active="shares" />

            <Card>
                <CardHeader>
                    <CardTitle>Velem megosztott</CardTitle>
                </CardHeader>
                <CardContent>
                    {withUser.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nincs megosztás.
                        </p>
                    ) : (
                        <ul className="space-y-3">
                            {withUser.map((item) => (
                                <li
                                    key={`${item.kind}-${item.id}`}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate">
                                            <span className="font-medium text-main">
                                                {item.kind}
                                            </span>
                                            <span className="text-muted-foreground"> | </span>
                                            {item.href ? (
                                                <Link
                                                    href={item.href}
                                                    className="font-semibold hover:underline"
                                                >
                                                    {item.name}
                                                </Link>
                                            ) : (
                                                <span className="font-semibold">{item.name}</span>
                                            )}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {item.owner}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className="text-sm text-muted-foreground">
                                            {roleLabel(item.role).toLowerCase()}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setRemoving({
                                                    url: item.leave,
                                                    message:
                                                        `Kilépsz ennek a megosztásából: ` +
                                                        `${item.name}?`,
                                                })
                                            }
                                        >
                                            Kilépés
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Általam megosztott</CardTitle>
                </CardHeader>
                <CardContent>
                    {byUser.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Nincs megosztás.
                        </p>
                    ) : (
                        byUser.map((group, index) => (
                            <div key={`${group.label}-${group.id}`}>
                                {index > 0 && <Separator className="my-4" />}
                                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                                    <span className="text-main">{group.label}</span> | {group.name}
                                </h3>
                                <ul className="space-y-3">
                                    {group.shares.map((share) => (
                                        <li
                                            key={share.id}
                                            className="flex items-center justify-between gap-2"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-semibold">{share.name}</p>
                                                <p
                                                    className="truncate text-sm
                                                        text-muted-foreground"
                                                >
                                                    {share.email}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <RoleSelect
                                                    value={share.role}
                                                    field={group.field}
                                                    url={route(`${group.resource}.shares.update`, [
                                                        group.id,
                                                        share.id,
                                                    ])}
                                                    label={`${share.name} szerepköre`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label="Megosztás törlése"
                                                    onClick={() =>
                                                        setRemoving({
                                                            url: route(
                                                                `${group.resource}.shares.destroy`,
                                                                [group.id, share.id],
                                                            ),
                                                            message:
                                                                `Megszünteted ${share.name} ` +
                                                                `hozzáférését: ${group.name}?`,
                                                        })
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <DeleteDialog
                url={removing?.url ?? null}
                message={removing?.message ?? ''}
                onClose={() => setRemoving(null)}
                cancelLabel="Nem"
                confirmLabel="Igen"
            />
        </div>
    );
}
