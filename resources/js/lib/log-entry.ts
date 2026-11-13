import { ClipboardList, Dumbbell, HeartPulse, Wheat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LogEntry, LogKind } from '@/types/log-entry';

export const KINDS: Record<
    LogKind,
    { icon: LucideIcon; className: string; active: string; label: string }
> = {
    feed: {
        icon: Wheat,
        className: 'bg-feed',
        active: 'border-transparent bg-feed text-white hover:bg-feed hover:text-white',
        label: 'Etetés',
    },
    exercise: {
        icon: Dumbbell,
        className: 'bg-exercise',
        active: 'border-transparent bg-exercise text-white hover:bg-exercise hover:text-white',
        label: 'Edzés',
    },
    health: {
        icon: HeartPulse,
        className: 'bg-health',
        active: 'border-transparent bg-health text-white hover:bg-health hover:text-white',
        label: 'Egészség',
    },
    observation: {
        icon: ClipboardList,
        className: 'bg-main',
        active: 'border-transparent bg-main text-white hover:bg-main hover:text-white',
        label: 'Megfigyelés',
    },
};

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) {
        return `${remaining} perc`;
    }

    return remaining === 0 ? `${hours} óra` : `${hours} óra ${remaining} perc`;
}

export function formatDetail(logEntry: LogEntry) {
    const { detail } = logEntry;

    if (logEntry.kind === 'feed' && detail.quantity) {
        return `${detail.quantity} ${detail.unit ?? ''}`;
    }

    if (logEntry.kind === 'exercise' && detail.duration_minutes) {
        return formatDuration(detail.duration_minutes);
    }

    if (logEntry.kind === 'observation') {
        if (detail.weight_kg && detail.height_cm) {
            return `${detail.weight_kg} kg | ${detail.height_cm} cm`;
        }

        if (detail.weight_kg) {
            return `${detail.weight_kg} kg`;
        }

        if (detail.height_cm) {
            return `${detail.height_cm} cm`;
        }
    }

    return '';
}
