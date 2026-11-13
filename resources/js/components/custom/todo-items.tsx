import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { TodoItem, TodoList } from '@/types/todo';

interface TodoItemsProps {
    stableId: number;
    list: TodoList;
    canEdit: boolean;
}

export default function TodoItems({ stableId, list, canEdit }: TodoItemsProps) {
    const toggleItem = (item: TodoItem, checked: boolean) =>
        router.put(
            route('stables.todo-lists.items.complete', [stableId, list.id, item.id]),
            { is_completed: checked },
            { preserveScroll: true, preserveState: true },
        );

    const removeItem = (item: TodoItem) =>
        router.delete(route('stables.todo-lists.items.destroy', [stableId, list.id, item.id]), {
            preserveScroll: true,
            preserveState: true,
        });

    return (
        <ul className="flex flex-col gap-1">
            {list.items.length === 0 && (
                <li className="text-sm text-muted-foreground">Nincs teendő.</li>
            )}

            {list.items.map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                        id={`todo-item-${item.id}`}
                        checked={item.is_completed}
                        onCheckedChange={(checked) => toggleItem(item, checked === true)}
                    />
                    <label
                        htmlFor={`todo-item-${item.id}`}
                        className={`flex-1
                            ${item.is_completed ? 'text-muted-foreground line-through' : ''}`}
                    >
                        {item.title}
                        {item.completed_by && (
                            <span className="ml-2 text-xs no-underline">({item.completed_by})</span>
                        )}
                    </label>
                    {canEdit && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Teendő törlése"
                            onClick={() => removeItem(item)}
                        >
                            <X />
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    );
}
