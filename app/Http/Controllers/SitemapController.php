<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Project;
use App\Models\Service;
use App\Support\Locales;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $locales = Locales::ALL;
        $base = rtrim(config('app.url'), '/');

        $urls = [];

        // Static pages
        $staticRoutes = ['', '/about', '/services', '/projects', '/blog', '/contact', '/privacy'];
        foreach ($staticRoutes as $path) {
            foreach ($locales as $locale) {
                $url = $base . '/' . $locale . $path;
                $alternates = [];
                foreach ($locales as $alt) {
                    $alternates[] = [
                        'href' => $base . '/' . $alt . $path,
                        'hreflang' => $alt,
                    ];
                }
                $urls[] = [
                    'loc' => $url,
                    'changefreq' => 'weekly',
                    'priority' => $path === '' ? '1.0' : '0.8',
                    'alternates' => $alternates,
                ];
            }
        }

        // Service detail pages
        $services = Service::published()->ordered()->get(['slug', 'updated_at']);
        foreach ($services as $service) {
            foreach ($locales as $locale) {
                $path = "/{$locale}/services/{$service->slug}";
                $alternates = [];
                foreach ($locales as $alt) {
                    $alternates[] = [
                        'href' => $base . "/{$alt}/services/{$service->slug}",
                        'hreflang' => $alt,
                    ];
                }
                $urls[] = [
                    'loc' => $base . $path,
                    'changefreq' => 'monthly',
                    'priority' => '0.7',
                    'lastmod' => $service->updated_at?->toDateString(),
                    'alternates' => $alternates,
                ];
            }
        }

        // Project detail pages
        $projects = Project::published()->ordered()->get(['slug', 'updated_at']);
        foreach ($projects as $project) {
            foreach ($locales as $locale) {
                $path = "/{$locale}/projects/{$project->slug}";
                $alternates = [];
                foreach ($locales as $alt) {
                    $alternates[] = [
                        'href' => $base . "/{$alt}/projects/{$project->slug}",
                        'hreflang' => $alt,
                    ];
                }
                $urls[] = [
                    'loc' => $base . $path,
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                    'lastmod' => $project->updated_at?->toDateString(),
                    'alternates' => $alternates,
                ];
            }
        }

        // Blog post pages
        $posts = BlogPost::published()->ordered()->get(['slug', 'updated_at', 'published_at']);
        foreach ($posts as $post) {
            foreach ($locales as $locale) {
                $path = "/{$locale}/blog/{$post->slug}";
                $alternates = [];
                foreach ($locales as $alt) {
                    $alternates[] = [
                        'href' => $base . "/{$alt}/blog/{$post->slug}",
                        'hreflang' => $alt,
                    ];
                }
                $urls[] = [
                    'loc' => $base . $path,
                    'changefreq' => 'monthly',
                    'priority' => '0.6',
                    'lastmod' => ($post->updated_at ?? $post->published_at)?->toDateString(),
                    'alternates' => $alternates,
                ];
            }
        }

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }
}
