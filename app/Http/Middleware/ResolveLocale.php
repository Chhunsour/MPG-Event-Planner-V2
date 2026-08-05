<?php

namespace App\Http\Middleware;

use App\Support\Locales;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Picks the response locale for the public API from `?locale=` and falls back
 * to English for anything unrecognised. Stored on the request so API resources
 * can read it without re-parsing.
 */
class ResolveLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = Locales::normalise((string) $request->query('locale', Locales::FALLBACK));

        $request->attributes->set('locale', $locale);
        app()->setLocale($locale);

        return $next($request);
    }
}
