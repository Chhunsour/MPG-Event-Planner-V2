import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { AxiosInstance } from 'axios';
import { RouteParams, RouteName } from 'ziggy-js';

declare global {
    interface PageProps extends InertiaPageProps {
        // Add shared props here, e.g.:
        // auth: { user: User };
    }

    interface Window {
        axios: AxiosInstance;
    }
}

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps {
        // Add shared props here
    }
}

export {};
