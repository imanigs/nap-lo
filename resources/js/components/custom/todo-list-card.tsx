import { useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import TodoItems from '@/components/custom/todo-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TodoList } from '@/types/todo';

interface TodoListCardProps {
    stableId: number;
    list: TodoList;
    canEdit: boolean;
    onDelete?: () => void;
}

export default function TodoListCard({ stableId, list, canEdit, onDelete }: TodoListCardProps) {
    const [renaming, setRenaming] = useState(false);
    const renameForm = useForm({ title: list.title });
    const newItemForm = useForm({ title: '' });

    const submitRename: FormEventHandler = (e) => {
        e.preventDefault();
        renameForm.put(route('stables.todo-lists.update', [stableId, list.id]), {
            preserveScroll: true,
            onSuccess: () => setRenaming(false),
        });
    };

    const submitItem: FormEventHandler = (e) => {
        e.preventDefault();
        newItemForm.post(route('stables.todo-lists.items.store', [stableId, list.id]), {
            preserveScroll: true,
            onSuccess: () => newItemForm.reset(),
        });
    };

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
            <header
                className="flex items-center justify-between gap-2 bg-main py-1 pr-1 pl-3
                    text-white"
            >
                {renaming ? (
                    <form
                        onSubmit={submitRename}
                        className="flex min-w-0 flex-1 items-center gap-1"
                    >
                        <Input
                            value={renameForm.data.title}
                            onChange={(e) => renameForm.setData('title', e.target.value)}
                            maxLength={32}
                            autoFocus
                            aria-label="Lista neve"
                            className="h-8 bg-background text-foreground"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            variant="secondary"
                            disabled={renameForm.processing}
                        >
                            Mentés
                        </Button>
                    </form>
                ) : (
                    <h3 className="truncate font-semibold">{list.title}</h3>
                )}

                {canEdit && (
                    <div className="flex shrink-0">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={renaming ? 'Mégse' : 'Átnevezés'}
                            onClick={() => setRenaming(!renaming)}
                            className="text-white hover:bg-white/20 hover:text-white"
                        >
                            {renaming ? <X /> : <Pencil />}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Törlés"
                            onClick={onDelete}
                            className="text-white hover:bg-white/20 hover:text-white"
                        >
                            <Trash2 />
                        </Button>
                    </div>
                )}
            </header>

            {renameForm.errors.title && (
                <p className="px-3 pt-2 text-sm text-destructive">{renameForm.errors.title}</p>
            )}

            <div className="p-3">
                <TodoItems stableId={stableId} list={list} canEdit={canEdit} />
            </div>

            {canEdit && (
                <form onSubmit={submitItem} className="flex items-center gap-2 border-t p-3">
                    <Input
                        value={newItemForm.data.title}
                        onChange={(e) => newItemForm.setData('title', e.target.value)}
                        placeholder="Új teendő"
                        maxLength={64}
                        aria-label="Új teendő"
                        disabled={newItemForm.processing}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        aria-label="Hozzáadás"
                        disabled={newItemForm.processing || newItemForm.data.title === ''}
                    >
                        <Plus />
                    </Button>
                </form>
            )}
            {newItemForm.errors.title && (
                <p className="px-3 pb-2 text-sm text-destructive">{newItemForm.errors.title}</p>
            )}
        </article>
    );
}
