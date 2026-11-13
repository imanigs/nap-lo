import { router } from '@inertiajs/react';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

export const ROLES = [
    { value: 'full', label: 'Teljes' },
    { value: 'caretaker', label: 'Gondozó' },
    { value: 'viewer', label: 'Megtekintő' },
];

export function roleLabel(value: string) {
    const role = ROLES.find((item) => item.value === value);

    if (role) {
        return role.label;
    }

    return value;
}

interface RoleSelectProps {
    value: string;
    field: 'horse_role' | 'stable_role';
    url: string;
    label: string;
}

export default function RoleSelect({ value, field, url, label }: RoleSelectProps) {
    return (
        <NativeSelect
            value={value}
            onChange={(e) =>
                router.patch(url, { [field]: e.target.value }, { preserveScroll: true })
            }
            aria-label={label}
            size="sm"
        >
            {ROLES.map((role) => (
                <NativeSelectOption key={role.value} value={role.value}>
                    {role.label}
                </NativeSelectOption>
            ))}
        </NativeSelect>
    );
}
