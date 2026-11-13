import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import type { Horse } from '@/types/horse';

export default function HorseCard({ horse }: { horse: Horse }) {
    return (
        <Link
            href={route('horses.show', horse.id)}
            className="group block w-36 rounded-xl focus:ring-2 focus:ring-ring focus:outline-none"
        >
            <Card
                className="min-h-[170px] px-2 transition-colors group-hover:border-main/50
                    group-hover:bg-main/5"
            >
                <CardContent className="flex flex-col items-center text-center">
                    <Avatar className="mb-1 h-24 w-24 border shadow-sm">
                        <AvatarImage src={horse.picture ?? undefined} alt={horse.name} />
                        <AvatarFallback className="bg-muted text-2xl">
                            {horse.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold">{horse.name}</h2>
                    {horse.status && (
                        <p className="text-sm leading-tight text-muted-foreground">
                            {horse.status}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
