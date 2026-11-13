import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';
import { buttonVariants } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { props, flash } = usePage();
    const { auth } = props;
    const user = auth.user;

    useEffect(() => {
        if (flash.status) {
            toast.success(flash.status);
        }
    }, [flash]);

    return (
        <main>
            <Toaster />

            <header className="flex items-center justify-between border-b bg-primary p-3">
                <Link
                    className="flex items-center gap-2 text-lg font-bold text-background"
                    href={route('home')}
                >
                    <img src="/logo.png" alt="" className="-my-0.5 size-8" />
                    NapLó
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger className={buttonVariants({ size: 'sm' })}>
                        <Menu className="size-5"></Menu>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        {user ? (
                            <>
                                <DropdownMenuItem render={<Link href={route('dashboard')} />}>
                                    Főoldal
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('horses.index')} />}>
                                    Lovak
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('calendar')} />}>
                                    Naptár
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('reminders')} />}>
                                    Emlékeztetők
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('todo')} />}>
                                    Teendők
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('settings.edit')} />}>
                                    Beállítások
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    nativeButton
                                    render={
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full"
                                        />
                                    }
                                >
                                    Kilépés
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuItem render={<Link href={route('login')} />}>
                                    Belépés
                                </DropdownMenuItem>

                                <DropdownMenuItem render={<Link href={route('register')} />}>
                                    Regisztráció
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <article>{children}</article>
        </main>
    );
}
