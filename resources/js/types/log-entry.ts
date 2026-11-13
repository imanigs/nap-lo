import type { FeedRoutine } from './feed';
import type { Horse } from './horse';

export type LogKind = 'feed' | 'exercise' | 'health' | 'observation';

export interface LogEntryDetail {
    category?: { value: string; label: string; icon: string | null };
    quantity?: number | null;
    unit?: string | null;
    duration_minutes?: number | null;
    weight_kg?: number | null;
    height_cm?: number | null;
    notes?: string | null;
}

export interface LogEntry {
    key: string;
    kind: LogKind;
    horse: Horse;
    log_id: number;
    title: string;
    date: string;
    time: string | null;
    done: boolean | null;
    detail: LogEntryDetail;
    can_edit: boolean;
}

export interface HorseHistoryData {
    from: string;
    to: string;
    kinds: LogKind[];
    log_entries: LogEntry[];
    routines: FeedRoutine[];
}
