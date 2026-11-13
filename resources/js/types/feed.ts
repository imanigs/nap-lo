import type { Horse } from './horse';

export interface FeedCategoryOption {
    value: string;
    label: string;
    icon: string | null;
}

export interface FeedUnitOption {
    value: string;
    label: string;
}

export interface FeedRoutine {
    id: number;
    label: string;
    category: FeedCategoryOption;
    is_ad_lib: boolean;
    quantity: number | null;
    unit: FeedUnitOption | null;
    days_of_week: number[] | null;
    times_of_day: string[] | null;
    starts_at: string;
    ends_at: string | null;
    notes: string | null;
    horse?: Horse;
}
