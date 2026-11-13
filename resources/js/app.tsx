import { createInertiaApp } from '@inertiajs/react';
import Layout from './layouts/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    strictMode: true,
    progress: {
        color: '#4B5563',
    },
    layout: () => Layout,
});
