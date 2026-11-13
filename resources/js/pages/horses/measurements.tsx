import { Head, usePage } from '@inertiajs/react';
import HorseTabs from '@/components/custom/horse-tabs';
import MeasurementForm from '@/components/custom/measurement-form';
import type { Horse } from '@/types/horse';
import type { Measurement } from '@/types/measurement';

export default function Measurements() {
    const { horse, abilities, measurement } = usePage<{
        horse: Horse;
        abilities: string[];
        measurement: Measurement;
    }>().props;

    return (
        <div className="mx-auto max-w-2xl p-4 sm:p-8">
            <Head title="Méretek" />
            <HorseTabs horse={horse} abilities={abilities} active="measurements" />

            <MeasurementForm horseId={horse.id} measurement={measurement} />
        </div>
    );
}
