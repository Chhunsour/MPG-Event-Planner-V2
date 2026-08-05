<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gate for everything under /admin.
 *
 * Being signed in is not enough — the account must carry the `is_admin` flag.
 * An authenticated non-admin gets a 403 rather than a redirect, so the
 * existence of the dashboard is never confirmed to an ordinary account.
 */
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated.'], 401)
                : redirect()->guest(route('admin.login'));
        }

        if (! $user->isAdmin()) {
            abort(403);
        }

        return $next($request);
    }
}
