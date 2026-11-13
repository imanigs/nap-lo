import { Form, router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import DeleteDialog from '@/components/custom/delete-dialog';
import RoleSelect, { ROLES, roleLabel } from '@/components/custom/role-select';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import type { Share, ShareSearch } from '@/types/share';

interface ShareManagerProps {
    shares: Share[];
    search: ShareSearch | null;
    canManage: boolean;
    roleField: 'horse_role' | 'stable_role';
    searchUrl: string;
    storeUrl: string;
    updateUrl: (id: number) => string;
    destroyUrl: (id: number) => string;
}

export default function ShareManager({
    shares,
    search,
    canManage,
    roleField,
    searchUrl,
    storeUrl,
    updateUrl,
    destroyUrl,
}: ShareManagerProps) {
    const [removing, setRemoving] = useState<Share | null>(null);
    const searchOptions = { only: ['search'], preserveState: true, preserveScroll: true };

    const cancelSearch = () => {
        router.get(searchUrl, {}, searchOptions);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Megosztás</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {shares.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Még nincs megosztva senkivel.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {shares.map((share) => (
                                <li
                                    key={share.id}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold">{share.name}</p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {share.email}
                                            {!canManage &&
                                                ` | ${roleLabel(share.role).toLowerCase()}`}
                                        </p>
                                    </div>
                                    {canManage && (
                                        <div className="flex shrink-0 items-center gap-2">
                                            <RoleSelect
                                                value={share.role}
                                                field={roleField}
                                                url={updateUrl(share.id)}
                                                label={`${share.name} szerepköre`}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                aria-label="Megosztás törlése"
                                                onClick={() => setRemoving(share)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}

                    {canManage && (
                        <Form
                            action={searchUrl}
                            method="get"
                            options={searchOptions}
                        >
                            {({ processing }) => (
                                <Field>
                                    <FieldLabel data-required htmlFor="share_email">
                                        Megosztás email cím alapján
                                    </FieldLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            id="share_email"
                                            name="share_email"
                                            type="email"
                                            placeholder="pl.: kiss.anna@email.hu"
                                            disabled={processing}
                                            required
                                        />
                                        <Button type="submit" disabled={processing}>
                                            Keresés
                                        </Button>
                                    </div>
                                    {search?.error && <FieldError>{search.error}</FieldError>}
                                </Field>
                            )}
                        </Form>
                    )}

                    {canManage && search?.user && (
                        <Form action={storeUrl} method="post">
                            {({ processing, errors }) => (
                                <div className="space-y-3 rounded-md border p-3">
                                    <p className="text-sm">
                                        Ezzel a felhasználóval szeretnéd megosztani?
                                    </p>
                                    <div>
                                        <p className="font-bold">{search.user?.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {search.user?.email}
                                        </p>
                                    </div>

                                    <input type="hidden" name="email" value={search.user?.email} />

                                    <Field>
                                        <FieldLabel data-required htmlFor={roleField}>
                                            Szerepkör
                                        </FieldLabel>
                                        <NativeSelect
                                            id={roleField}
                                            name={roleField}
                                            defaultValue="viewer"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {ROLES.map((role) => (
                                                <NativeSelectOption
                                                    key={role.value}
                                                    value={role.value}
                                                >
                                                    {role.label}
                                                </NativeSelectOption>
                                            ))}
                                        </NativeSelect>
                                        {errors[roleField] && (
                                            <FieldError>{errors[roleField]}</FieldError>
                                        )}
                                        {errors.email && <FieldError>{errors.email}</FieldError>}
                                    </Field>

                                    <div className="flex justify-end gap-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={processing}
                                            onClick={cancelSearch}
                                        >
                                            Mégse
                                        </Button>
                                        <Button type="submit" disabled={processing}>
                                            Megosztás
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )}
                </CardContent>
            </Card>

            <DeleteDialog
                url={removing && destroyUrl(removing.id)}
                message={`Biztosan megszünteted ${removing?.name} megosztását?`}
                onClose={() => setRemoving(null)}
                cancelLabel="Nem"
                confirmLabel="Igen"
            />
        </>
    );
}
