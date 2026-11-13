import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

export default function TimeBadge({ children }: { children: ReactNode }) {
    return (
        <Badge variant="secondary" className="h-[22px] px-2.5 text-[13px] tabular-nums">
            {children}
        </Badge>
    );
}
