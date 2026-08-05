<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*'],

    // The public API is read-only content plus the quotation POST. Nothing else
    // is reachable cross-origin, so the preflight does not need to advertise
    // PUT/DELETE/PATCH.
    'allowed_methods' => ['GET', 'POST', 'OPTIONS'],

    'allowed_origins' => array_values(array_filter(
        array_map(trim(...), explode(',', (string) env('FRONTEND_URL', 'http://localhost:3000')))
    )),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With', 'Accept-Language'],

    'exposed_headers' => [],

    // Cache the preflight for a day; the answer never varies per request.
    'max_age' => 86400,

    /*
     * The API authenticates nobody — the admin is session-authenticated on the
     * `web` routes, which are not in `paths` above. Allowing credentials here
     * would let a browser attach the admin's session cookie to cross-origin API
     * calls for no benefit, so it stays off.
     */
    'supports_credentials' => false,

];
