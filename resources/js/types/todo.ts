export interface TodoItem {
    id: number;
    title: string;
    is_completed: boolean;
    completed_by: string | null;
}

export interface TodoList {
    id: number;
    title: string;
    items: TodoItem[];
}
