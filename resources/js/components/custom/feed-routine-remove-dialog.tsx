import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { route } from 'ziggy-js';
import DatePicker from '@/components/custom/date-picker';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { FeedRoutine } from '@/types/feed';

interface FeedRoutineRemoveDialogProps {
    horseId: number;
    routine: FeedRoutine;
    onClose: () => void;
}

export default function FeedRoutineRemoveDialog({
    horseId,
    routine,
    onClose,
}: FeedRoutineRemoveDialogProps) {
    const today = format(new Date(), 'yyyy-MM-dd');
    const canClose = !routine.ends_at || routine.ends_at >= today;
    const form = useForm({ ends_at: today });
    const options = { preserveScroll: true, onSuccess: onClose };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const deleteRoutine = () => {
        form.delete(route('horses.feed-routines.destroy', [horseId, routine.id]), options);
    };

    const closeRoutine = () => {
        form.post(route('horses.feed-routines.close', [horseId, routine.id]), options);
    };

    return (
        <AlertDialog open onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogTitle>{routine.label}</AlertDialogTitle>
                <AlertDialogDescription>
                    {canClose
                        ? 'Törölni szeretnéd a bejegyzést, vagy csak ' +
                          'megváltozott a ló etetési rutinja?'
                        : 'Biztosan törlöd? A törlés az etetési előzményekből is eltávolítja.'}
                </AlertDialogDescription>

                {canClose && (
                    <DatePicker
                        id="feed_ends_at"
                        label="Utolsó nap"
                        value={form.data.ends_at}
                        onChange={(value) => form.setData('ends_at', value)}
                        error={form.errors.ends_at}
                        disabled={form.processing}
                    />
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={form.processing}>Vissza</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={form.processing}
                        onClick={deleteRoutine}
                    >
                        Törlés
                    </Button>
                    {canClose && (
                        <Button disabled={form.processing} onClick={closeRoutine}>
                            Lezárás
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
