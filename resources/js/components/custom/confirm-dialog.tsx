import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    message: string;
    processing?: boolean;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmVariant?: 'default' | 'destructive';
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    message,
    processing,
    cancelLabel = 'Nem',
    confirmLabel = 'Igen',
    confirmVariant = 'destructive',
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogTitle>Megerősítés</AlertDialogTitle>
                <AlertDialogDescription className="whitespace-pre-line">
                    {message}
                </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={processing}>{cancelLabel}</AlertDialogCancel>
                    <Button variant={confirmVariant} onClick={onConfirm} disabled={processing}>
                        {confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
