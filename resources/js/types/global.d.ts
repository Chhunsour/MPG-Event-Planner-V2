import type { Config } from 'ziggy-js';

declare global {
    const route: <Name extends RouteName = RouteName>(
        name?: Name,
        params?: RouteParams<Name>,
        absolute?: boolean,
    ) => string;

    const Ziggy: Config;

    interface Window {
        route: <Name extends RouteName = RouteName>(
            name?: Name,
            params?: RouteParams<Name>,
            absolute?: boolean,
        ) => string;
        Ziggy: Config;
    }
}

export {};
