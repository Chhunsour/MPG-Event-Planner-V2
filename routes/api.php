<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\QuotationRequestController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
| Read-only content endpoints plus the quotation submission form.
| Locale is resolved from ?locale= query parameter via the ResolveLocale
| middleware, falling back to English.
*/

Route::middleware('locale')->group(function () {

    // Sanctum CSRF cookie endpoint for SPA auth
    Route::get('/sanctum/csrf-cookie', [AuthController::class, 'csrfCookie']);

    // Public content (read-only)
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{slug}', [ServiceController::class, 'show']);

    Route::get('projects', [ProjectController::class, 'index']);
    Route::get('projects/{slug}', [ProjectController::class, 'show']);

    Route::get('blog', [BlogPostController::class, 'index']);
    Route::get('blog/{slug}', [BlogPostController::class, 'show']);

    // Quotation request submission (throttled)
    Route::post('quotation-requests', [QuotationRequestController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('api.quotation-requests.store');

    Route::post('quotation', [QuotationRequestController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('api.quotation.store');
});

/*
|--------------------------------------------------------------------------
| Authenticated API Routes
|--------------------------------------------------------------------------
| Admin auth endpoints for SPA-based admin panel usage.
*/

Route::post('login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

Route::post('logout', [AuthController::class, 'logout'])->middleware('auth');
Route::get('user', [AuthController::class, 'user'])->middleware('auth');
