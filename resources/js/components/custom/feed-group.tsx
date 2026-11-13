import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import HorseAvatar from '@/components/custom/horse-avatar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDetail } from '@/lib/log-entry';
import type { LogEntry } from '@/types/log-entry';

export default function FeedGroup({ items }: { items: LogEntry[] }) {
    const doneCount = items.filter((item) => item.done).length;

    const tick = (item: LogEntry, checked: boolean) => {
        const routeParams = [item.horse.id, item.log_id];
        const data = { date: item.date, time: item.time };

        if (checked) {
            const url = route('horses.feed-routines.logs.store', routeParams);
            router.post(url, data, { preserveScroll: true });

            return;
        }

        const url = route('horses.feed-routines.logs.destroy', routeParams);
        router.delete(url, { data, preserveScroll: true });
    };

    return (
        <li className="flex items-start gap-2">
            <Accordion className="min-w-0 flex-1">
                <AccordionItem value="feed">
                    <AccordionTrigger className="items-center gap-2 py-0 hover:no-underline">
                        <span className="flex-1 text-main-dark">Etetés</span>
                        {doneCount > 0 && (
                            <Badge variant="secondary">
                                {doneCount}/{items.length}
                            </Badge>
                        )}
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="space-y-2 pt-3">
                            {items.map((item) => (
                                <li key={item.key} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={item.done === true}
                                        disabled={!item.can_edit}
                                        onCheckedChange={(checked) => tick(item, checked === true)}
                                        aria-label="Megetetve"
                                    />
                                    <HorseAvatar horse={item.horse} size="sm" />
                                    <p
                                        className={
                                            item.done
                                                ? 'truncate text-muted-foreground line-through'
                                                : 'truncate'
                                        }
                                    >
                                        <span className="font-semibold">
                                            {item.horse.name}
                                        </span>
                                        {` | ${item.title}`}
                                        {formatDetail(item) && ` | ${formatDetail(item)}`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <CategoryIcon kind="feed" />
        </li>
    );
}
