<?php

use App\Http\Controllers\PageController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\QuotationController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TranslationController;
use App\Models\QuotationRequest;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| SEO routes
|--------------------------------------------------------------------------
*/
Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/robots.txt', function () {
    $content = "User-agent: *\nDisallow: /admin\nDisallow: /api\n\nSitemap: " . rtrim(config('app.url'), '/') . "/sitemap.xml\n";
    return response($content, 200, ['Content-Type' => 'text/plain']);
});

/*
|--------------------------------------------------------------------------
| Public site (Inertia)
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => redirect('/en'));

Route::prefix('{locale}')->where(['locale' => 'en|km|zh'])->group(function () {
    Route::get('/', [PageController::class, 'home'])->name('home');
    Route::get('/about', [PageController::class, 'about'])->name('about');
    Route::get('/services', [PageController::class, 'services'])->name('services');
    Route::get('/services/{slug}', [PageController::class, 'serviceDetail'])->name('service.detail');
    Route::get('/projects', [PageController::class, 'projects'])->name('projects');
    Route::get('/projects/{slug}', [PageController::class, 'projectDetail'])->name('project.detail');
    Route::get('/blog', [PageController::class, 'blog'])->name('blog');
    Route::get('/blog/{slug}', [PageController::class, 'blogPost'])->name('blog.post');
    Route::get('/contact', [PageController::class, 'contact'])->name('contact');
    Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
    Route::get('/thank-you', [PageController::class, 'thankYou'])->name('thank-you');
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:10,1')
            ->name('login.attempt');
    });

    Route::post('logout', [AuthController::class, 'logout'])
        ->middleware('auth')
        ->name('logout');

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', fn () => redirect()->route('admin.dashboard'));
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Services
        Route::get('services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('services/create', [ServiceController::class, 'create'])->name('services.create');
        Route::post('services/bulk', [ServiceController::class, 'bulk'])->name('services.bulk');
        Route::post('services', [ServiceController::class, 'store'])->name('services.store');
        Route::get('services/{service}/edit', [ServiceController::class, 'edit'])->name('services.edit');
        Route::put('services/{service}', [ServiceController::class, 'update'])->name('services.update');
        Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');
        Route::post('services/{service}/duplicate', [ServiceController::class, 'duplicate'])->name('services.duplicate');
        Route::post('services/{service}/restore', [ServiceController::class, 'restore'])->withTrashed()->name('services.restore');
        Route::post('services/{service}/publish', [ServiceController::class, 'togglePublish'])->name('services.publish');
        Route::post('services/{service}/reorder', [ServiceController::class, 'reorder'])->name('services.reorder');

        Route::post('media', [MediaController::class, 'store'])->name('media.store');
        Route::get('media', [MediaController::class, 'index'])->name('media.index');
        Route::post('translations', [TranslationController::class, 'store'])
            ->middleware('throttle:20,1')
            ->name('translations.store');

        // Projects
        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::get('projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('projects/bulk', [ProjectController::class, 'bulk'])->name('projects.bulk');
        Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::post('projects/{project}/duplicate', [ProjectController::class, 'duplicate'])->name('projects.duplicate');
        Route::post('projects/{project}/restore', [ProjectController::class, 'restore'])->withTrashed()->name('projects.restore');
        Route::post('projects/{project}/publish', [ProjectController::class, 'togglePublish'])->name('projects.publish');
        Route::post('projects/{project}/feature', [ProjectController::class, 'toggleFeatured'])->name('projects.feature');
        Route::post('projects/{project}/reorder', [ProjectController::class, 'reorder'])->name('projects.reorder');

        // Project gallery
        Route::delete('projects/{project}/images/{image}', [ProjectController::class, 'destroyImage'])->name('projects.images.destroy');
        Route::post('projects/{project}/images/{image}/cover', [ProjectController::class, 'makeCover'])->name('projects.images.cover');
        Route::post('projects/{project}/images/reorder', [ProjectController::class, 'reorderImages'])->name('projects.images.reorder');

        // Blog posts
        Route::get('blog', [BlogPostController::class, 'index'])->name('blog.index');
        Route::get('blog/create', [BlogPostController::class, 'create'])->name('blog.create');
        Route::post('blog/bulk', [BlogPostController::class, 'bulk'])->name('blog.bulk');
        Route::post('blog', [BlogPostController::class, 'store'])->name('blog.store');
        Route::get('blog/{blog}/edit', [BlogPostController::class, 'edit'])->name('blog.edit');
        Route::put('blog/{blog}', [BlogPostController::class, 'update'])->name('blog.update');
        Route::delete('blog/{blog}', [BlogPostController::class, 'destroy'])->name('blog.destroy');
        Route::post('blog/{blog}/duplicate', [BlogPostController::class, 'duplicate'])->name('blog.duplicate');
        Route::post('blog/{blog}/restore', [BlogPostController::class, 'restore'])->withTrashed()->name('blog.restore');
        Route::post('blog/{blog}/publish', [BlogPostController::class, 'togglePublish'])->name('blog.publish');

        // Messages (quotation requests)
        Route::get('messages', [QuotationController::class, 'index'])->name('messages.index');
        Route::get('messages/{quotation}', [QuotationController::class, 'show'])->name('messages.show');
        Route::put('messages/{quotation}', [QuotationController::class, 'update'])->name('messages.update');

        Route::get('quotations', fn () => redirect()->route('admin.messages.index', [], 301))
            ->name('quotations.index');
        Route::get('quotations/{quotation}', fn (QuotationRequest $quotation) => redirect()->route('admin.messages.show', $quotation, 301)
        )->name('quotations.show');

        Route::get('settings', [SettingController::class, 'index'])->name('settings');
        Route::post('settings', [SettingController::class, 'update'])->name('settings.update');
    });
});
