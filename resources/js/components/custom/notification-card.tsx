import { Link, router } from '@inertiajs/react';
import { Bell, X } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import CategoryIcon from '@/components/custom/category-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AppNotification } from '@/types/notification';

interface NotificationCardProps {
    notifications: AppNotification[];
    today: string;
}

const SHOWN = 5;
const MILLISECONDS_IN_A_DAY = 86400000;

function dayText(date: string, today: string) {
    const days = Math.round((Date.parse(date) - Date.parse(today)) / MILLISECONDS_IN_A_DAY);

    if (days === 0) {
        return 'Ma';
    }

    return days === 1 ? 'Holnap' : `${days} nap múlva`;
}

export default function NotificationCard({ notifications, today }: NotificationCardProps) {
    const [showAll, setShowAll] = useState(false);
    const hiddenCount = notifications.length - SHOWN;

    let shownNotifications = notifications.slice(0, SHOWN);

    if (showAll) {
        shownNotifications = notifications;
    }

    const markAsRead = (id: string) => {
        router.post(
            route('notifications.read', id),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    const markAllAsRead = () => {
        router.post(
            route('notifications.read-all'),
            {},
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <Card size="sm" className="gap-0 py-0">
            <CardHeader className="bg-main py-2 text-white">
                <CardTitle className="flex items-center gap-2">
                    <Bell className="size-4" />
                    Értesítések
                    <Badge variant="secondary">{notifications.length}</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent className="py-1">
                <ul className="divide-y">
                    {shownNotifications.map(({ id, data }) => (
                        <li key={id} className="flex items-center gap-2 py-2">
                            <Link
                                href={data.url}
                                className="flex min-w-0 flex-1 items-center gap-2"
                            >
                                <CategoryIcon
                                    kind={data.kind}
                                    category={data.category ?? undefined}
                                />
                                <span className="min-w-0 flex-1 text-sm">
                                    <span className="block truncate">
                                        <span className="font-semibold">{data.horse}</span>
                                        <span className="text-muted-foreground"> | </span>
                                        <span className="text-main-dark">{data.title}</span>
                                    </span>
                                    {data.date < today ? (
                                        <Badge variant="destructive">
                                            Lejárt | {data.date}
                                        </Badge>
                                    ) : (
                                        <span
                                            className="block truncate text-xs
                                                text-muted-foreground"
                                        >
                                            <span className="font-medium text-foreground">
                                                {dayText(data.date, today)}
                                            </span>
                                            {` | ${data.date}`}
                                            {data.time && ` ${data.time}`}
                                        </span>
                                    )}
                                </span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Olvasottnak jelölöm"
                                onClick={() => markAsRead(id)}
                            >
                                <X />
                            </Button>
                        </li>
                    ))}
                </ul>

                {notifications.length > 1 && (
                    <div className="flex items-center justify-between border-t py-1">
                        {hiddenCount > 0 ? (
                            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)}>
                                {showAll ? 'Kevesebb' : `Még ${hiddenCount} értesítés`}
                            </Button>
                        ) : (
                            <span />
                        )}
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                            Az összeset elolvastam
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
