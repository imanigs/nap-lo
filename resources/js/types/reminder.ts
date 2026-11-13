import type { LogEntry } from './log-entry';

export interface Reminder {
    id: number;
    days_before: number;
    log_entry: LogEntry;
}
