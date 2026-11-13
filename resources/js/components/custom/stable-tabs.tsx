import { route } from 'ziggy-js';
import PageTabs from '@/components/custom/page-tabs';
import type { Stable } from '@/types/stable';

interface StableTabsProps {
    stable: Stable;
    active: 'edit' | 'shares';
}

export default function StableTabs({ stable, active }: StableTabsProps) {
    return (
        <PageTabs
            backHref={route('horses.index')}
            active={active}
            tabs={[
                {
                    key: 'edit',
                    label: 'Adatok',
                    href: route('stables.edit', stable.id),
                    visible: true,
                },
                {
                    key: 'shares',
                    label: 'Megosztás',
                    href: route('stables.shares.index', stable.id),
                    visible: true,
                },
            ]}
        />
    );
}
