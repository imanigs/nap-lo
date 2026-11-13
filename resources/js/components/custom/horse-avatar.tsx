import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Horse } from '@/types/horse';

export default function HorseAvatar({ horse, size }: { horse: Horse; size?: 'sm' | 'default' }) {
    return (
        <Avatar size={size}>
            <AvatarImage src={horse.picture ?? undefined} alt={horse.name} />
            <AvatarFallback>{horse.name.charAt(0)}</AvatarFallback>
        </Avatar>
    );
}
