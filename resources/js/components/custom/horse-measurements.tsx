import type { Measurement } from '@/types/measurement';

interface HorseMeasurementsProps {
    measurement: Measurement;
}

export const MEASUREMENT_FIELDS: { name: keyof Measurement; label: string }[] = [
    { name: 'girth_size', label: 'Heveder' },
    { name: 'bit_size', label: 'Zabla' },
    { name: 'blanket_size', label: 'Takaró' },
    { name: 'bridle_size', label: 'Kantár' },
    { name: 'saddle_size', label: 'Nyereg' },
    { name: 'feet_size', label: 'Lábszár' },
];

export default function HorseMeasurements({ measurement }: HorseMeasurementsProps) {
    return (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
            {MEASUREMENT_FIELDS.map((field) => (
                <div key={field.name} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">{field.label}</dt>
                    <dd className="font-medium">{measurement[field.name] || '-'}</dd>
                </div>
            ))}
        </dl>
    );
}
