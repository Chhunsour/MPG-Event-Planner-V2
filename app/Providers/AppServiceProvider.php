<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /*
         * Next.js forwards the request to Laravel's private origin. Without
         * this, Laravel builds form actions and auth redirects from the
         * forwarded backend host, leaking users out of the main domain.
         * APP_URL is the public canonical origin in this deployment.
         */
        $publicUrl = rtrim((string) config('app.url'), '/');
        URL::forceRootUrl($publicUrl);

        if (str_starts_with($publicUrl, 'https://')) {
            URL::forceScheme('https');
        }
    }
}
