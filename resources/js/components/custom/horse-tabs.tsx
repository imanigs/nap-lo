import { route } from 'ziggy-js';
import PageTabs from '@/components/custom/page-tabs';
import type { Horse } from '@/types/horse';

interface HorseTabsProps {
    horse: Horse;
    abilities: string[];
    active: 'edit' | 'measurements' | 'shares' | 'settings';
}

export default function HorseTabs({ horse, abilities, active }: HorseTabsProps) {
    return (
        <PageTabs
            backHref={route('horses.show', horse.id)}
            active={active}
            tabs={[
                {
                    key: 'edit',
                    label: 'Adatok',
                    href: route('horses.edit', horse.id),
                    visible: true,
                },
                {
                    key: 'measurements',
                    label: 'Méretek',
                    href: route('horses.measurement.edit', horse.id),
                    visible: true,
                },
                {
                    key: 'shares',
                    label: 'Megosztás',
                    href: route('horses.shares.index', horse.id),
                    visible: abilities.includes('view_shares'),
                },
                {
                    key: 'settings',
                    label: 'Beállítások',
                    href: route('horses.settings', horse.id),
                    visible: abilities.includes('delete'),
                },
            ]}
        />
    );
}
