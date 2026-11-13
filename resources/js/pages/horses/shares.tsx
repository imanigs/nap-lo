import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import HorseTabs from '@/components/custom/horse-tabs';
import ShareManager from '@/components/custom/share-manager';
import type { Horse } from '@/types/horse';
import type { Share, ShareSearch } from '@/types/share';

export default function Shares() {
    const { horse, abilities, shares, search } = usePage<{
        horse: Horse;
        abilities: string[];
        shares: Share[];
        search: ShareSearch | null;
    }>().props;

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Megosztás" />
            <HorseTabs horse={horse} abilities={abilities} active="shares" />

            <ShareManager
                shares={shares}
                search={search}
                canManage={abilities.includes('manage_shares')}
                roleField="horse_role"
                searchUrl={route('horses.shares.index', horse.id)}
                storeUrl={route('horses.shares.store', horse.id)}
                updateUrl={(id) => route('horses.shares.update', [horse.id, id])}
                destroyUrl={(id) => route('horses.shares.destroy', [horse.id, id])}
            />
        </div>
    );
}
