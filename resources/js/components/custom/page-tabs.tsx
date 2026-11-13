import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
    key: string;
    label: string;
    href: string;
    visible: boolean;
}

interface PageTabsProps {
    backHref?: string;
    tabs: Tab[];
    active: string;
}

export default function PageTabs({ backHref, tabs, active }: PageTabsProps) {
    return (
        <nav className="mb-4 flex items-center gap-4 border-b">
            {backHref && (
                <Link
                    href={backHref}
                    aria-label="Vissza"
                    className={buttonVariants({ variant: 'outline', size: 'icon' })}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            )}

            <Tabs value={active}>
                <TabsList variant="line" className="group-data-horizontal/tabs:h-auto">
                    {tabs
                        .filter((tab) => tab.visible)
                        .map((tab) => (
                            <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                nativeButton={false}
                                render={<Link href={tab.href} />}
                                className="flex-none px-1 py-2 after:bg-main
                                    group-data-horizontal/tabs:after:bottom-0 data-active:text-main"
                            >
                                {tab.label}
                            </TabsTrigger>
                        ))}
                </TabsList>
            </Tabs>
        </nav>
    );
}
