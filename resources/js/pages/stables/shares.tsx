import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import ShareManager from '@/components/custom/share-manager';
import StableTabs from '@/components/custom/stable-tabs';
import type { Share, ShareSearch } from '@/types/share';
import type { Stable } from '@/types/stable';

export default function Shares() {
    const { stable, shares, search } = usePage<{
        stable: Stable;
        shares: Share[];
        search: ShareSearch | null;
    }>().props;

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Megosztás" />
            <StableTabs stable={stable} active="shares" />

            <ShareManager
                shares={shares}
                search={search}
                canManage
                roleField="stable_role"
                searchUrl={route('stables.shares.index', stable.id)}
                storeUrl={route('stables.shares.store', stable.id)}
                updateUrl={(id) => route('stables.shares.update', [stable.id, id])}
                destroyUrl={(id) => route('stables.shares.destroy', [stable.id, id])}
            />
        </div>
    );
}
