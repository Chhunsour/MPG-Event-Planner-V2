<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Response hardening headers for the admin dashboard.
 *
 * These are the browser-side half of the XSS defence: the sanitizer keeps
 * hostile markup out of the database, and the CSP here limits the damage if
 * something ever gets past it — an injected <script>, inline or remote, simply
 * does not execute.
 *
 * `script-src 'self'` is only meaningful because the dashboard has no inline
 * script left: everything moved to `public/admin.js` and data attributes. Adding
 * `unsafe-inline` back would silently void this whole file.
 *
 * `style-src` does still allow inline styles — the Blade views use `style="…"`
 * attributes throughout, and inline CSS is not an execution vector once script
 * is locked down. Removing them is a refactor, not a fix.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        foreach ($this->headers($request) as $name => $value) {
            // Never clobber a header a controller set deliberately.
            if (! $response->headers->has($name)) {
                $response->headers->set($name, $value);
            }
        }

        // Reveals the framework and PHP version, which is free reconnaissance
        // for anyone matching a target against known CVEs.
        $response->headers->remove('X-Powered-By');

        return $response;
    }

    /** @return array<string, string> */
    private function headers(Request $request): array
    {
        $headers = [
            // The dashboard is not embeddable anywhere, so refuse framing
            // outright: no clickjacking surface for the destructive actions.
            'X-Frame-Options' => 'DENY',

            // Stop the browser from second-guessing Content-Type — an uploaded
            // file served as image/jpeg must never be sniffed into script.
            'X-Content-Type-Options' => 'nosniff',

            // Admin URLs carry record IDs; do not leak them to other origins.
            'Referrer-Policy' => 'same-origin',

            'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',

            'Content-Security-Policy' => $this->contentSecurityPolicy($request),

            // Old admin pages must not sit in a shared cache.
            'X-Permitted-Cross-Domain-Policies' => 'none',
        ];

        // HSTS is only meaningful over TLS, and sending it from a plain-HTTP
        // local environment would pin developers' browsers to an https://
        // localhost that does not exist.
        if ($request->secure()) {
            $headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains';
        }

        return $headers;
    }

    private function contentSecurityPolicy(Request $request): string
    {
        $directives = [
            "default-src 'self'",
            "base-uri 'self'",

            // No inline script, no eval, no third-party CDN. This is the
            // directive that turns a stored-XSS bug into a no-op.
            "script-src 'self'",

            // See the class docblock: inline styles stay for now.
            "style-src 'self' 'unsafe-inline'",

            // data: covers the inline SVG icons; blob: is not needed.
            "img-src 'self' data:",

            "font-src 'self' data:",

            // The dashboard is server-rendered forms only — it makes no
            // cross-origin XHR, so nothing needs to be reachable.
            "connect-src 'self'",

            "form-action 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",

            // Belt and braces with X-Frame-Options for older browsers.
            "frame-src 'none'",
        ];

        // Only once the site is actually on TLS — over plain HTTP in local dev
        // this rewrites every asset URL to an https:// port that is not served.
        if ($request->secure()) {
            $directives[] = 'upgrade-insecure-requests';
        }

        return implode('; ', $directives);
    }
}
