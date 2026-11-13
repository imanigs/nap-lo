import type { Horse } from './horse';

export interface ExerciseCategoryOption {
    value: string;
    label: string;
    icon: string | null;
}

export interface ExerciseIntensityOption {
    value: string;
    label: string;
}

export interface Exercise {
    id: number;
    label: string;
    category: ExerciseCategoryOption;
    done: boolean;
    duration_minutes: number | null;
    intensity: ExerciseIntensityOption | null;
    date: string;
    time: string | null;
    notes: string | null;
    horse?: Horse;
}
