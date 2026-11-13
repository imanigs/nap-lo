import { Link } from '@inertiajs/react';
import { ArrowLeft, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { route } from 'ziggy-js';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import type { Horse } from '@/types/horse';

interface HorseHeaderProps {
    horse: Horse;
    canEdit: boolean;
    actions?: ReactNode;
    backHref?: string;
    children?: ReactNode;
}

export default function HorseHeader({
    horse,
    canEdit,
    actions,
    backHref,
    children,
}: HorseHeaderProps) {
    const summary = (
        <span className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="size-20">
                <AvatarImage src={horse.picture ?? undefined} alt={horse.name} />
                <AvatarFallback className="bg-muted text-3xl">
                    {horse.name.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <span className="min-w-0 flex-1">
                <span className="block truncate text-xl leading-tight font-bold">{horse.name}</span>
                {horse.status && (
                    <span
                        className="inline-block rounded-full bg-main/10 px-2 py-0.5 text-xs
                            font-medium text-main"
                    >
                        {horse.status}
                    </span>
                )}
            </span>
        </span>
    );

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Link
                    href={backHref ?? route('horses.index')}
                    aria-label="Vissza"
                    className={buttonVariants({ variant: 'outline', size: 'icon' })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <div className="flex items-center gap-2">
                    {actions}
                    {canEdit && (
                        <Link
                            href={route('horses.edit', horse.id)}
                            aria-label="Szerkesztés"
                            className={buttonVariants({ size: 'icon' })}
                        >
                            <Settings className="size-5" strokeWidth={1.5} />
                        </Link>
                    )}
                </div>
            </div>

            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                {children ? (
                    <Accordion>
                        <AccordionItem value="profile">
                            <AccordionTrigger
                                className="items-center rounded-none p-3 hover:no-underline
                                    **:data-[slot=accordion-trigger-icon]:mr-1"
                            >
                                {summary}
                            </AccordionTrigger>
                            <AccordionContent className="px-3 [&_p:not(:last-child)]:mb-0">
                                {children}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <div className="p-3">{summary}</div>
                )}
            </section>
        </div>
    );
}
