import { route } from 'ziggy-js';
import PageTabs from '@/components/custom/page-tabs';

export default function SettingsTabs({ active }: { active: 'account' | 'shares' }) {
    return (
        <PageTabs
            active={active}
            tabs={[
                { key: 'account', label: 'Fiók', href: route('settings.edit'), visible: true },
                {
                    key: 'shares',
                    label: 'Megosztások',
                    href: route('settings.shares'),
                    visible: true,
                },
            ]}
        />
    );
}
