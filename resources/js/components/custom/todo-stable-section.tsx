import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import DeleteDialog from '@/components/custom/delete-dialog';
import TodoListCard from '@/components/custom/todo-list-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TodoList } from '@/types/todo';

interface TodoStableSectionProps {
    stable: { id: number; name: string; todoLists: TodoList[]; canEdit: boolean };
}

export default function TodoStableSection({ stable }: TodoStableSectionProps) {
    const [removing, setRemoving] = useState<TodoList | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({ title: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('stables.todo-lists.store', stable.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <section className="space-y-3">
            <header className="border-b-2 border-main pb-1">
                <h2 className="text-xl font-bold tracking-tight text-main-dark">{stable.name}</h2>
            </header>

            {stable.canEdit && (
                <form onSubmit={submit} className="flex items-start gap-2">
                    <div className="flex-1">
                        <Input
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Új lista neve"
                            maxLength={32}
                            aria-label="Új lista neve"
                            disabled={processing}
                        />
                        {errors.title && (
                            <p className="pt-1 text-sm text-destructive">{errors.title}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={processing || data.title === ''}>
                        <Plus /> Lista
                    </Button>
                </form>
            )}

            {stable.todoLists.length === 0 && (
                <p className="text-sm text-muted-foreground">Nincs lista.</p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                {stable.todoLists.map((list) => (
                    <TodoListCard
                        key={list.id}
                        stableId={stable.id}
                        list={list}
                        canEdit={stable.canEdit}
                        onDelete={() => setRemoving(list)}
                    />
                ))}
            </div>

            <DeleteDialog
                url={removing && route('stables.todo-lists.destroy', [stable.id, removing.id])}
                message={`Biztosan törlöd a(z) „${removing?.title}” listát a teendőivel együtt?`}
                onClose={() => setRemoving(null)}
            />
        </section>
    );
}
