<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\Project;
use App\Models\Service;
use App\Support\ImageStorage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private readonly ImageStorage $images) {}

    public function home(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        $projects = Project::published()->ordered()->limit(5)->get()
            ->map(fn ($p) => $this->mapProject($p, $locale));

        $posts = BlogPost::published()->ordered()->limit(3)->get()
            ->map(fn ($p) => $this->mapBlogPost($p, $locale));

        return Inertia::render('Home', [
            'locale' => $locale,
            'services' => $services,
            'projects' => $projects,
            'posts' => $posts,
        ]);
    }

    public function about(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('About', [
            'locale' => $locale,
            'services' => $services,
        ]);
    }

    public function services(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('Services', [
            'locale' => $locale,
            'services' => $services,
        ]);
    }

    public function serviceDetail(string $locale, string $slug): Response
    {
        $service = Service::published()->where('slug', $slug)->first();

        if (! $service) {
            abort(404);
        }

        $services = Service::published()->ordered()->limit(8)->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        $projects = Project::published()
            ->where('service_id', $service->id)
            ->ordered()
            ->limit(6)
            ->get()
            ->map(fn ($p) => $this->mapProject($p, $locale));

        return Inertia::render('ServiceDetail', [
            'locale' => $locale,
            'service' => $this->mapService($service, $locale),
            'services' => $services,
            'projects' => $projects,
        ]);
    }

    public function projects(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        $projects = Project::published()->ordered()->get()
            ->map(fn ($p) => $this->mapProject($p, $locale));

        return Inertia::render('Projects', [
            'locale' => $locale,
            'projects' => $projects,
            'services' => $services,
        ]);
    }

    public function projectDetail(string $locale, string $slug): Response
    {
        $project = Project::published()->where('slug', $slug)->first();

        if (! $project) {
            abort(404);
        }

        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        $projects = Project::published()
            ->where('service_id', $project->service_id)
            ->ordered()
            ->limit(8)
            ->get()
            ->map(fn ($p) => $this->mapProject($p, $locale));

        return Inertia::render('ProjectDetail', [
            'locale' => $locale,
            'project' => $this->mapProject($project, $locale),
            'projects' => $projects,
            'services' => $services,
        ]);
    }

    public function blog(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        $posts = BlogPost::published()->ordered()->get()
            ->map(fn ($p) => $this->mapBlogPost($p, $locale));

        return Inertia::render('Blog', [
            'locale' => $locale,
            'posts' => $posts,
            'services' => $services,
        ]);
    }

    public function blogPost(string $locale, string $slug): Response
    {
        $post = BlogPost::published()->where('slug', $slug)->first();

        if (! $post) {
            abort(404);
        }

        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('BlogPostPage', [
            'locale' => $locale,
            'post' => $this->mapBlogPost($post, $locale),
            'services' => $services,
        ]);
    }

    public function contact(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('Contact', [
            'locale' => $locale,
            'services' => $services,
        ]);
    }

    public function privacy(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('Privacy', [
            'locale' => $locale,
            'services' => $services,
        ]);
    }

    public function thankYou(string $locale): Response
    {
        $services = Service::published()->ordered()->get()
            ->map(fn ($s) => $this->mapService($s, $locale));

        return Inertia::render('ThankYou', [
            'locale' => $locale,
            'services' => $services,
        ]);
    }

    private function mapService(Service $s, string $locale): array
    {
        return [
            'id' => $s->id,
            'slug' => $s->slug,
            'category' => $s->category,
            'title' => $s->translate('title', $locale),
            'short_description' => $s->translate('short_description', $locale),
            'description' => $s->translate('description', $locale),
            'seo_title' => $s->translate('seo_title', $locale),
            'seo_description' => $s->translate('seo_description', $locale),
            'image' => $this->images->url($s->image),
            'image_alt' => $s->imageAlt($locale),
            'social_image' => $this->images->url($s->social_image),
            'social_image_alt' => $s->translate('social_image_alt', $locale),
            'is_featured' => $s->is_featured,
            'display_order' => $s->display_order,
            'capabilities' => $s->capabilities->pluck('label')->toArray(),
            'updated_at' => $s->updated_at?->toIso8601String(),
        ];
    }

    private function mapProject(Project $p, string $locale): array
    {
        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'category' => $p->category,
            'title' => $p->translate('title', $locale),
            'description' => $p->translate('description', $locale),
            'short_description' => $p->translate('short_description', $locale),
            'seo_title' => $p->translate('seo_title', $locale),
            'seo_description' => $p->translate('seo_description', $locale),
            'client_name' => $p->client_name,
            'event_type' => $p->event_type,
            'location' => $p->location,
            'event_date' => $p->event_date?->format('Y-m-d'),
            'year' => $p->year,
            'cover_image' => $this->images->url($p->cover_image),
            'cover_image_alt' => $p->coverImageAlt($locale),
            'social_image' => $this->images->url($p->social_image),
            'social_image_alt' => $p->translate('social_image_alt', $locale),
            'is_featured' => $p->is_featured,
            'display_order' => $p->display_order,
            'service' => $p->service ? [
                'slug' => $p->service->slug,
                'title' => $p->service->translate('title', $locale),
            ] : null,
            'technologies' => $p->technologies ?? [],
            'gallery' => $p->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $this->images->url($img->path),
                'alt' => $img->alt ?? '',
                'width' => $img->width,
                'height' => $img->height,
            ])->toArray(),
            'features' => $p->features->pluck('label')->toArray(),
            'updated_at' => $p->updated_at?->toIso8601String(),
        ];
    }

    private function mapBlogPost(BlogPost $p, string $locale): array
    {
        return [
            'id' => $p->id,
            'slug' => $p->slug,
            'title' => $p->translate('title', $locale),
            'excerpt' => $p->translate('excerpt', $locale),
            'body' => $p->translate('body', $locale),
            'category' => $p->category,
            'tags' => $p->tags ?? [],
            'cover_image' => $this->images->url($p->cover_image),
            'cover_image_alt' => $p->coverImageAlt($locale),
            'seo_title' => $p->translate('seo_title', $locale),
            'seo_description' => $p->translate('seo_description', $locale),
            'meta_description' => $p->translate('meta_description', $locale),
            'social_image' => $this->images->url($p->social_image),
            'social_image_alt' => $p->translate('social_image_alt', $locale),
            'author_name' => $p->author_name,
            'published_at' => $p->published_at?->toIso8601String(),
            'updated_at' => $p->updated_at?->toIso8601String(),
        ];
    }
}
