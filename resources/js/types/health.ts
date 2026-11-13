import type { Horse } from './horse';

export interface HealthCategoryOption {
    value: string;
    label: string;
    icon: string | null;
}

export interface HealthRepeatUnitOption {
    value: string;
    label: string;
}

export interface HealthRecord {
    id: number;
    label: string;
    category: HealthCategoryOption;
    done: boolean;
    date: string;
    time: string | null;
    repeat_every: number | null;
    repeat_unit: HealthRepeatUnitOption | null;
    notes: string | null;
    remind_before?: number | null;
    horse?: Horse;
}
