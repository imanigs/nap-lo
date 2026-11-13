import { Head, usePage } from '@inertiajs/react';
import TodoStableSection from '@/components/custom/todo-stable-section';
import type { TodoList } from '@/types/todo';

export default function Todo() {
    const { stables } = usePage<{
        stables: { id: number; name: string; todoLists: TodoList[]; canEdit: boolean }[];
    }>().props;

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-8">
            <Head title="Teendők" />
            {stables.map((stable) => (
                <TodoStableSection key={stable.id} stable={stable} />
            ))}
        </div>
    );
}
