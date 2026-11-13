import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileTab {
    key: string;
    label: string;
    icon: LucideIcon;
    content: ReactNode;
}

interface ProfileTabsProps {
    tabs: ProfileTab[];
}

export default function ProfileTabs({ tabs }: ProfileTabsProps) {
    return (
        <Tabs defaultValue={tabs[0].key} className="gap-3">
            <TabsList className="w-full rounded-full group-data-horizontal/tabs:h-auto">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="rounded-full py-2 data-active:bg-main data-active:text-white"
                    >
                        <tab.icon />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.key} value={tab.key} className="px-1 pt-1">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
