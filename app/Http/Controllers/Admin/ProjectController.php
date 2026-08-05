<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use App\Models\ProjectFeature;
use App\Models\ProjectImage;
use App\Models\Service;
use App\Support\ImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(private readonly ImageStorage $images) {}

    public function index(Request $request): Response
    {
        $status = $request->string('status')->trim()->value();
        $baseQuery = Project::query();
        if ($status === 'archived') {
            $baseQuery->onlyTrashed();
        } else {
            $baseQuery->when($status === 'published', fn ($q) => $q->published())
                ->when($status === 'scheduled', fn ($q) => $q->where('is_published', true)->where('published_at', '>', now()))
                ->when($status === 'draft', fn ($q) => $q->where('is_published', false));
        }

        $projects = $baseQuery
            ->with('service')
            ->withCount('images')
            ->when($request->filled('q'), function ($query) use ($request) {
                $term = '%'.$request->string('q')->trim().'%';
                $query->where(fn ($q) => $q
                    ->where('title_en', 'like', $term)
                    ->orWhere('title_km', 'like', $term)
                        ->orWhere('title_zh', 'like', $term)
                        ->orWhere('client_name', 'like', $term)
                        ->orWhere('location', 'like', $term)
                        ->orWhere('category', 'like', $term));
            })
            ->when($request->filled('language'), function ($query) use ($request) {
                $language = $request->string('language')->trim()->value();
                if (in_array($language, ['km', 'zh'], true)) {
                    $query->whereNotNull("title_{$language}")->where("title_{$language}", '!=', '');
                }
            })
            ->when($request->filled('service'), fn ($q) => $q->where('service_id', $request->integer('service')))
            ->when($request->filled('published'), fn ($q) => $q->where('is_published', $request->boolean('published')))
            ->when($request->filled('featured'), fn ($q) => $q->where('is_featured', $request->boolean('featured')))
            ->when($request->filled('year'), fn ($q) => $q->where('year', $request->integer('year')))
            ->ordered()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'services' => Service::ordered()->get(),
            'years' => Project::query()->whereNotNull('year')->distinct()->orderByDesc('year')->pluck('year'),
            'status' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => [
                ...new Project([
                    'is_published' => false,
                    'display_order' => (Project::max('display_order') ?? 0) + 1,
                    'author_name' => auth()->user()?->name ?? auth()->user()?->email,
                ])->toArray(),
                'exists' => false,
                'images' => [],
                'features' => [],
            ],
            'services' => Service::ordered()->get(),
        ]);
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        $project = DB::transaction(function () use ($request) {
            $project = Project::create($this->attributes($request));

            if ($request->hasFile('cover_image')) {
                $project->update([
                    'cover_image' => $this->images->store($request->file('cover_image'), 'projects'),
                ]);
            }

            if ($request->hasFile('social_image')) {
                $project->update([
                    'social_image' => $this->images->store($request->file('social_image'), 'projects/social'),
                ]);
            }

            $this->syncFeatures($project, $request);
            $this->addGalleryImages($project, $request);

            return $project;
        });

        return redirect()
            ->route('admin.projects.edit', $project)
            ->with('status', 'Project created.');
    }

    public function edit(Project $project): Response
    {
        $project->load(['images', 'features']);

        return Inertia::render('Admin/Projects/Form', [
            'project' => [
                ...$project->toArray(),
                'exists' => true,
                'images' => $project->images->map(fn ($img) => [
                    'id' => $img->id,
                    'path' => $img->path,
                    'alt' => $img->alt,
                ])->toArray(),
                'features' => $project->features->map(fn ($f) => [
                    'label_en' => $f->label_en,
                    'label_km' => $f->label_km,
                    'label_zh' => $f->label_zh,
                ])->toArray(),
            ],
            'services' => Service::ordered()->get(),
        ]);
    }

    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        DB::transaction(function () use ($request, $project) {
            $project->update($this->attributes($request, $project));

            if ($request->hasFile('cover_image')) {
                $previous = $project->cover_image;
                $project->update(['cover_image' => $this->images->store($request->file('cover_image'), 'projects')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_cover_image')) {
                $previous = $project->cover_image;
                $project->update(['cover_image' => null]);
                $this->images->delete($previous);
            }

            $this->addGalleryImages($project, $request);
            $this->syncFeatures($project, $request);
            $this->removeGalleryImages($project, $request);
            $this->reorderExistingImages($project, $request);

            if ($request->hasFile('social_image')) {
                $previous = $project->social_image;
                $project->update(['social_image' => $this->images->store($request->file('social_image'), 'projects/social')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_social_image')) {
                $previous = $project->social_image;
                $project->update(['social_image' => null]);
                $this->images->delete($previous);
            }
        });

        return redirect()
            ->route('admin.projects.edit', $project)
            ->with('status', 'Project saved.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()
            ->route('admin.projects.index')
            ->with('status', 'Project deleted.');
    }

    public function duplicate(Project $project): RedirectResponse
    {
        $copy = $project->replicate();
        $copy->title_en = 'Copy of '.$project->title_en;
        $copy->slug = $this->uniqueSlug($project->slug);
        $copy->is_published = false;
        $copy->published_at = null;
        $copy->is_featured = false;
        $copy->display_order = (Project::max('display_order') ?? 0) + 1;
        $copy->save();

        $project->load(['features', 'images']);
        foreach ($project->features as $feature) {
            $copy->features()->create([
                'label_en' => $feature->label_en,
                'label_km' => $feature->label_km,
                'label_zh' => $feature->label_zh,
                'display_order' => $feature->display_order,
            ]);
        }
        foreach ($project->images as $image) {
            $copy->images()->create([
                'path' => $image->path,
                'alt_en' => $image->alt_en,
                'alt_km' => $image->alt_km,
                'alt_zh' => $image->alt_zh,
                'width' => $image->width,
                'height' => $image->height,
                'display_order' => $image->display_order,
            ]);
        }

        return redirect()->route('admin.projects.edit', $copy)->with('status', 'Project duplicated as a draft.');
    }

    public function restore(Project $project): RedirectResponse
    {
        $project->restore();
        $project->update(['is_published' => false]);

        return back()->with('status', 'Project restored as a draft.');
    }

    public function bulk(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['integer', 'distinct'],
            'action' => ['required', 'in:publish,draft,archive,restore'],
        ]);

        $projects = Project::withTrashed()->whereIn('id', $data['ids'])->get();
        match ($data['action']) {
            'publish' => $projects->each->update(['is_published' => true, 'published_at' => now()]),
            'draft' => $projects->each->update(['is_published' => false]),
            'archive' => $projects->each->delete(),
            'restore' => $projects->each(function (Project $project) { $project->restore(); $project->update(['is_published' => false]); }),
        };

        return back()->with('status', 'Bulk project action completed.');
    }

    public function togglePublish(Request $request, Project $project): RedirectResponse
    {
        $published = $request->has('is_published')
            ? $request->boolean('is_published')
            : ! $project->is_published;
        $project->update([
            'is_published' => $published,
            'published_at' => $published ? now() : $project->published_at,
        ]);

        return back()->with(
            'status',
            $project->is_published ? 'Project published.' : 'Project unpublished.'
        );
    }

    public function toggleFeatured(Project $project): RedirectResponse
    {
        $project->update(['is_featured' => ! $project->is_featured]);

        return back();
    }

    public function reorder(Request $request, Project $project): RedirectResponse
    {
        $direction = $request->string('direction')->value() === 'up' ? 'up' : 'down';

        $neighbour = Project::query()
            ->when(
                $direction === 'up',
                fn ($q) => $q->where('display_order', '<', $project->display_order)->orderByDesc('display_order'),
                fn ($q) => $q->where('display_order', '>', $project->display_order)->orderBy('display_order')
            )
            ->first();

        if ($neighbour) {
            DB::transaction(function () use ($project, $neighbour) {
                $order = $project->display_order;
                $project->update(['display_order' => $neighbour->display_order]);
                $neighbour->update(['display_order' => $order]);
            });
        }

        return back();
    }

    /* ── Gallery ─────────────────────────────────────────────── */

    public function destroyImage(Project $project, ProjectImage $image): RedirectResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $path = $image->path;
        $image->delete();
        $this->images->delete($path);

        return back()->with('status', 'Image removed.');
    }

    /** Promote a gallery image to the project cover. */
    public function makeCover(Project $project, ProjectImage $image): RedirectResponse
    {
        abort_unless($image->project_id === $project->id, 404);

        $project->update([
            'cover_image' => $image->path,
            'cover_image_alt_en' => $image->alt_en,
            'cover_image_alt_km' => $image->alt_km,
            'cover_image_alt_zh' => $image->alt_zh,
        ]);

        return back()->with('status', 'Cover image updated.');
    }

    /** Persist a new gallery order submitted as a list of image ids. */
    public function reorderImages(Request $request, Project $project): RedirectResponse
    {
        $ids = collect($request->input('order', []))->map(fn ($id) => (int) $id);

        DB::transaction(function () use ($ids, $project) {
            $ids->each(function (int $id, int $index) use ($project) {
                ProjectImage::where('project_id', $project->id)
                    ->where('id', $id)
                    ->update(['display_order' => $index]);
            });
        });

        return back()->with('status', 'Gallery reordered.');
    }

    private function attributes(ProjectRequest $request, ?Project $project = null): array
    {
        return $request->safe()->except([
            'cover_image', 'remove_cover_image', 'gallery', 'social_image',
            'remove_social_image', 'features',
            'gallery_order', 'gallery_removed', 'publish_intent', 'publish_action', 'technologies_text', 'tags_text',
        ]) + ['display_order' => $request->filled('display_order')
            ? $request->integer('display_order')
            : ($project?->display_order ?? (Project::max('display_order') ?? 0) + 1)];
    }

    private function addGalleryImages(Project $project, ProjectRequest $request): void
    {
        if (! $request->hasFile('gallery')) {
            return;
        }

        $next = (int) ($project->images()->max('display_order') ?? -1) + 1;

        foreach ($request->file('gallery') as $file) {
            [$width, $height] = $this->images->dimensions($file);

            $project->images()->create([
                'path' => $this->images->store($file, "projects/{$project->id}"),
                'width' => $width,
                'height' => $height,
                'display_order' => $next++,
            ]);
        }
    }

    private function syncFeatures(Project $project, ProjectRequest $request): void
    {
        $rows = collect($request->input('features', []))
            ->filter(fn ($row) => filled($row['label_en'] ?? null))
            ->values()
            ->map(fn ($row, $index) => [
                'label_en' => $row['label_en'],
                'label_km' => $row['label_km'] ?? null,
                'label_zh' => $row['label_zh'] ?? null,
                'display_order' => $index,
            ]);

        $project->features()->delete();
        if ($rows->isNotEmpty()) {
            $project->features()->createMany($rows->all());
        }
    }

    private function reorderExistingImages(Project $project, ProjectRequest $request): void
    {
        $ids = collect(explode(',', (string) $request->input('gallery_order')))
            ->map(fn ($id) => (int) trim($id))
            ->filter()
            ->values();

        if ($ids->isEmpty()) return;

        $ids->each(fn (int $id, int $index) => ProjectImage::where('project_id', $project->id)
            ->where('id', $id)
            ->update(['display_order' => $index]));
    }

    private function removeGalleryImages(Project $project, ProjectRequest $request): void
    {
        foreach ($request->input('gallery_removed', []) as $id) {
            $image = $project->images()->whereKey((int) $id)->first();
            if (! $image) continue;
            $path = $image->path;
            $image->delete();
            $this->images->delete($path);
        }
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base.'-copy';
        $suffix = 2;
        while (Project::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-copy-'.$suffix++;
        }

        return $slug;
    }
}
