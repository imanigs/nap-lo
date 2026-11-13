import type { LogEntryDetail, LogKind } from './log-entry';

export interface AppNotification {
    id: string;
    data: {
        horse: string;
        title: string;
        kind: LogKind;
        category: LogEntryDetail['category'] | null;
        date: string;
        time: string | null;
        url: string;
    };
}
