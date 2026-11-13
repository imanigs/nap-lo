import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardLogProps {
    label: string;
    labelOnTop?: boolean;
    children: ReactNode;
}

export default function DashboardLog({ label, labelOnTop, children }: DashboardLogProps) {
    return (
        <div className={cn('flex gap-2', labelOnTop && 'flex-col gap-1')}>
            <p className={cn('text-sm font-semibold', !labelOnTop && 'w-10 shrink-0 pt-3')}>
                {label}
            </p>
            <Card size="sm" className="min-w-0 flex-1">
                <CardContent>
                    <ul className="space-y-2">{children}</ul>
                </CardContent>
            </Card>
        </div>
    );
}
