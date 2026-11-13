import { Head, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import HorseHeader from '@/components/custom/horse-header';
import HorseHistory from '@/components/custom/horse-history';
import { KINDS } from '@/lib/log-entry';
import type { Horse } from '@/types/horse';
import type { HorseHistoryData } from '@/types/log-entry';

export default function History() {
    const { horse, abilities, history } = usePage<{
        horse: Horse;
        abilities: string[];
        history: HorseHistoryData;
    }>().props;

    return (
        <div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-8">
            <Head title={`${horse.name} naplója`} />
            <HorseHeader
                horse={horse}
                canEdit={abilities.includes('edit_profile')}
                backHref={route('horses.show', horse.id)}
            />

            <HorseHistory
                horse={horse}
                history={history}
                kinds={[
                    { value: 'exercise', label: KINDS.exercise.label },
                    { value: 'health', label: KINDS.health.label },
                    { value: 'observation', label: KINDS.observation.label },
                    { value: 'feed', label: KINDS.feed.label },
                ]}
            />
        </div>
    );
}
