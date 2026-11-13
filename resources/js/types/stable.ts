import type { Horse } from './horse';

export interface Stable {
    id: number;
    name: string;
    horses: Horse[];
}
