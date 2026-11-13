import { format, parseISO } from 'date-fns';
import { hu } from 'date-fns/locale';
import type { ReactNode } from 'react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';

interface MonthCalendarProps {
    month: string;
    selected: string | null;
    onSelect: (date: string) => void;
    onMonthChange: (month: string) => void;
    renderDay: (date: string) => ReactNode;
}

const toDay = (date: Date) => format(date, 'yyyy-MM-dd');

export default function MonthCalendar({
    month,
    selected,
    onSelect,
    onMonthChange,
    renderDay,
}: MonthCalendarProps) {
    return (
        <Calendar
            mode="single"
            locale={hu}
            showOutsideDays={false}
            month={parseISO(`${month}-01`)}
            selected={selected ? parseISO(selected) : undefined}
            onDayClick={(date) => onSelect(toDay(date))}
            onMonthChange={(date) => onMonthChange(format(date, 'yyyy-MM'))}
            formatters={{ formatCaption: (date) => format(date, 'yyyy. LLLL', { locale: hu }) }}
            className="rounded-lg border"
            classNames={{
                root: 'mx-auto w-full max-w-88 lg:mx-0',
                caption_label: 'text-lg font-semibold',
            }}
            components={{
                DayButton: ({ children, ...props }) => (
                    <CalendarDayButton
                        {...props}
                        className="data-[selected-single=true]:bg-main/10
                            data-[selected-single=true]:text-foreground"
                    >
                        {children}
                        <span className="flex flex-wrap justify-center gap-0.5 opacity-100!">
                            {renderDay(toDay(props.day.date))}
                        </span>
                    </CalendarDayButton>
                ),
            }}
        />
    );
}
