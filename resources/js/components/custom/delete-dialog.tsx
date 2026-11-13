import { router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '@/components/custom/confirm-dialog';

interface DeleteDialogProps {
    url: string | null;
    message: string;
    onClose: () => void;
    cancelLabel?: string;
    confirmLabel?: string;
}

export default function DeleteDialog({
    url,
    message,
    onClose,
    cancelLabel = 'Vissza',
    confirmLabel = 'Törlés',
}: DeleteDialogProps) {
    const [deleting, setDeleting] = useState(false);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!url) {
            return;
        }

        router.delete(url, {
            preserveScroll: true,
            preserveState: true,
            onStart: () => setDeleting(true),
            onFinish: () => {
                setDeleting(false);
                onClose();
            },
        });
    };

    return (
        <ConfirmDialog
            open={url !== null}
            onOpenChange={handleOpenChange}
            onConfirm={handleConfirm}
            message={message}
            processing={deleting}
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
        />
    );
}
