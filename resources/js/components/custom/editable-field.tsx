import { useForm } from '@inertiajs/react';
import { Pencil, Check, X } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface EditableFieldProps {
    label: string;
    dbField: string;
    initialValue: string;
    type?: string;
    actionUrl: string;
}

export function EditableField({
    label,
    dbField,
    initialValue,
    type = 'text',
    actionUrl,
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, processing, errors, clearErrors } = useForm({
        [dbField]: initialValue,
    });

    const handleSave: FormEventHandler = (e) => {
        e.preventDefault();
        patch(actionUrl, {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        clearErrors();
        setData(dbField, initialValue);
    };

    return (
        <div className="border-t py-2">
            <div className="pb-0.5">
                <FieldLabel data-required>{label}</FieldLabel>
            </div>

            <div className="flex flex-1 items-center justify-between">
                {isEditing ? (
                    <form onSubmit={handleSave} className="flex flex-1 items-start gap-2">
                        <Field>
                            <Input
                                type={type}
                                value={data[dbField]}
                                onChange={(e) => setData(dbField, e.target.value)}
                                autoFocus
                                aria-invalid={!!errors[dbField]}
                            />
                            {errors[dbField] && (
                                <FieldError className="mt-1">{errors[dbField]}</FieldError>
                            )}
                        </Field>
                        <div className="flex items-center gap-1">
                            <Button type="submit" size="icon" disabled={processing}>
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleCancel}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <span className="text-foreground">{initialValue}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsEditing(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
