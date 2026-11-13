import { usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SectionTab {
    key: string;
    label: string;
    icon: LucideIcon;
    visible: boolean;
    content: ReactNode;
}

interface SectionTabsProps {
    tabs: SectionTab[];
}

export default function SectionTabs({ tabs }: SectionTabsProps) {
    const { url } = usePage();
    const visibleTabs = tabs.filter((tab) => tab.visible);

    if (visibleTabs.length === 0) {
        return null;
    }

    const urlParams = url.split('?')[1];
    const requestedKey = new URLSearchParams(urlParams).get('tab');
    const requestedTab = visibleTabs.find((tab) => tab.key === requestedKey);

    let defaultTab = visibleTabs[0];

    if (requestedTab) {
        defaultTab = requestedTab;
    }

    return (
        <Tabs defaultValue={defaultTab.key} className="gap-4">
            <TabsList
                variant="line"
                className="w-full rounded-none border-b group-data-horizontal/tabs:h-auto"
            >
                {visibleTabs.map((tab) => (
                    <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="flex-col px-1 py-2 text-xs after:bg-main
                            group-data-horizontal/tabs:after:bottom-0 sm:flex-row sm:text-sm
                            data-active:text-main"
                    >
                        <tab.icon />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {visibleTabs.map((tab) => (
                <TabsContent key={tab.key} value={tab.key} className="text-base">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
}
