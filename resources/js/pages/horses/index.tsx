import { Head, usePage, Link } from '@inertiajs/react';
import { Plus, Settings } from 'lucide-react';
import { route } from 'ziggy-js';
import HorseCard from '@/components/custom/horse-card';
import { buttonVariants } from '@/components/ui/button';
import type { Stable } from '@/types/stable';

export default function Index() {
    const { stable, sharedStables, shared } = usePage<{
        stable: Stable;
        sharedStables: Stable[];
        shared: Stable[];
    }>().props;

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4">
            <Head title="Lovaim" />
            <section className="space-y-3">
                <header className="flex items-center justify-between border-b-2 border-main pb-1">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-main-dark">
                            Saját istállóm
                        </h2>
                        <p className="text-sm text-muted-foreground">{stable.name}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route('horses.create')} className={buttonVariants()}>
                            <Plus className="size-5" strokeWidth={2.2} />
                            Új ló
                        </Link>
                        <Link
                            href={route('stables.edit', stable.id)}
                            aria-label="Istálló beállításai"
                            className={buttonVariants({ size: 'icon' })}
                        >
                            <Settings className="size-6" strokeWidth={1.5} />
                        </Link>
                    </div>
                </header>

                <div className="flex flex-wrap justify-center gap-2">
                    {stable.horses.map((horse) => (
                        <HorseCard key={horse.id} horse={horse} />
                    ))}
                </div>
            </section>

            {sharedStables.map((sharedStable) => (
                <section key={sharedStable.id} className="space-y-3">
                    <header
                        className="flex items-center justify-between border-b-2 border-main pb-1"
                    >
                        <h2 className="text-xl font-bold tracking-tight text-main-dark">
                            {sharedStable.name}
                        </h2>
                    </header>

                    <div className="flex flex-wrap justify-center gap-2">
                        {sharedStable.horses.map((horse) => (
                            <HorseCard key={horse.id} horse={horse} />
                        ))}
                    </div>
                </section>
            ))}

            {shared.length > 0 && (
                <section className="space-y-1">
                    <header className="border-b-2 border-main pb-1">
                        <h2 className="text-xl font-bold tracking-tight text-main-dark">
                            Megosztott lovak
                        </h2>
                    </header>

                    {shared.map((sharedStable) => (
                        <div key={sharedStable.id} className="space-y-0.5 pt-1">
                            <p className="text-sm text-muted-foreground">{sharedStable.name}</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {sharedStable.horses.map((horse) => (
                                    <HorseCard key={horse.id} horse={horse} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
