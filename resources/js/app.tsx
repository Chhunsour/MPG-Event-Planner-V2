import './css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './components/ui/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'MPG Event Planner';

router.on('navigate', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
});

const pages = import.meta.glob('./Pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = (await pages[`./Pages/${name}.tsx`]()) as { default: React.ComponentType };
        return page.default;
    },
    setup({ el, App, props }) {
        if (!el.dataset.root) {
            const root = createRoot(el);
            el.dataset.root = '1';
            root.render(
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>,
            );
        }
    },
    progress: {
        color: '#f59e0b',
    },
});
