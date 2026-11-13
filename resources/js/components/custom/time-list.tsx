import { Plus } from 'lucide-react';
import TimeInput from '@/components/custom/time-input';

interface TimeListProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
}

const SUGGESTED_TIMES = ['07:00', '12:00', '18:00', '21:00'];
const MAX_TIMES = 12;

function nextFreeTime(taken: string[]) {
    const freeTime = SUGGESTED_TIMES.find((time) => !taken.includes(time));

    if (freeTime) {
        return freeTime;
    }

    return '12:00';
}

export default function TimeList({ value, onChange, disabled }: TimeListProps) {
    const changeTime = (index: number, newTime: string) => {
        onChange(value.map((time, timeIndex) => (timeIndex === index ? newTime : time)));
    };

    const removeTime = (index: number) => {
        onChange(value.filter((time, timeIndex) => timeIndex !== index));
    };

    return (
        <ul className="flex flex-wrap items-center gap-1.5">
            {value.map((time, index) => (
                <li key={index}>
                    <TimeInput
                        value={time}
                        onChange={(newTime) => changeTime(index, newTime)}
                        onRemove={value.length > 1 ? () => removeTime(index) : undefined}
                        disabled={disabled}
                    />
                </li>
            ))}
            <li>
                <button
                    type="button"
                    disabled={disabled || value.length >= MAX_TIMES}
                    onClick={() => onChange([...value, nextFreeTime(value)])}
                    className="flex cursor-pointer items-center gap-1 rounded-full border
                        border-dashed px-2.5 py-0.5 text-sm hover:border-main hover:text-main
                        disabled:opacity-50"
                >
                    <Plus className="size-3.5" /> idő
                </button>
            </li>
        </ul>
    );
}
