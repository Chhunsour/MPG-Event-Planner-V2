<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Models\Service;
use App\Support\ImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(private readonly ImageStorage $images) {}

    public function index(Request $request): Response
    {
        $status = $request->string('status')->trim()->value();
        $query = Service::query()->withCount('projects');

        if ($status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->when($status === 'published', fn ($q) => $q->published())
                ->when($status === 'scheduled', fn ($q) => $q->where('is_published', true)->where('published_at', '>', now()))
                ->when($status === 'draft', fn ($q) => $q->where('is_published', false));
        }

        return Inertia::render('Admin/Services/Index', [
            'services' => $query
                ->when($request->filled('q'), function ($query) use ($request) {
                    $term = '%'.$request->string('q')->trim().'%';
                    $query->where(fn ($q) => $q
                        ->where('title_en', 'like', $term)
                        ->orWhere('title_km', 'like', $term)
                        ->orWhere('title_zh', 'like', $term)
                        ->orWhere('category', 'like', $term));
                })
                ->when($request->filled('language'), function ($query) use ($request) {
                    $language = $request->string('language')->trim()->value();
                    if (in_array($language, ['en', 'km', 'zh'], true) && $language !== 'en') {
                        $query->whereNotNull("title_{$language}")->where("title_{$language}", '!=', '');
                    }
                })
                ->ordered()
                ->paginate(20)
                ->withQueryString(),
            'status' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Services/Form', [
            'service' => [
                ...new Service([
                    'is_published' => false,
                    'display_order' => (Service::max('display_order') ?? 0) + 1,
                    'author_name' => auth()->user()?->name ?? auth()->user()?->email,
                ])->toArray(),
                'exists' => false,
                'capabilities' => [],
            ],
        ]);
    }

    public function store(ServiceRequest $request): RedirectResponse
    {
        $service = DB::transaction(function () use ($request) {
            $service = Service::create($this->attributes($request));
            $this->syncCapabilities($service, $request);

            if ($request->hasFile('image')) {
                $service->update([
                    'image' => $this->images->store($request->file('image'), 'services'),
                ]);
            }

            if ($request->hasFile('social_image')) {
                $service->update([
                    'social_image' => $this->images->store($request->file('social_image'), 'services/social'),
                ]);
            }

            return $service;
        });

        return redirect()
            ->route('admin.services.index')
            ->with('status', 'Service created.');
    }

    public function edit(Service $service): Response
    {
        $service->load('capabilities');

        return Inertia::render('Admin/Services/Form', [
            'service' => [
                ...$service->toArray(),
                'exists' => true,
                'capabilities' => $service->capabilities->map(fn ($c) => [
                    'label_en' => $c->label_en,
                    'label_km' => $c->label_km,
                    'label_zh' => $c->label_zh,
                ])->toArray(),
            ],
        ]);
    }

    public function update(ServiceRequest $request, Service $service): RedirectResponse
    {
        DB::transaction(function () use ($request, $service) {
            $service->update($this->attributes($request, $service));
            $this->syncCapabilities($service, $request);

            if ($request->hasFile('image')) {
                $previous = $service->image;
                $service->update(['image' => $this->images->store($request->file('image'), 'services')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_image')) {
                $previous = $service->image;
                $service->update(['image' => null]);
                $this->images->delete($previous);
            }

            if ($request->hasFile('social_image')) {
                $previous = $service->social_image;
                $service->update(['social_image' => $this->images->store($request->file('social_image'), 'services/social')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_social_image')) {
                $previous = $service->social_image;
                $service->update(['social_image' => null]);
                $this->images->delete($previous);
            }
        });

        return redirect()
            ->route('admin.services.index')
            ->with('status', 'Service saved.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        // Soft delete: the image stays on disk so the action stays reversible.
        $service->delete();

        return redirect()
            ->route('admin.services.index')
            ->with('status', 'Service deleted.');
    }

    public function duplicate(Service $service): RedirectResponse
    {
        $copy = $service->replicate();
        $copy->title_en = 'Copy of '.$service->title_en;
        $copy->slug = $this->uniqueSlug($service->slug);
        $copy->is_published = false;
        $copy->published_at = null;
        $copy->is_featured = false;
        $copy->display_order = (Service::max('display_order') ?? 0) + 1;
        $copy->save();

        $service->load('capabilities');
        foreach ($service->capabilities as $capability) {
            $copy->capabilities()->create([
                'label_en' => $capability->label_en,
                'label_km' => $capability->label_km,
                'label_zh' => $capability->label_zh,
                'display_order' => $capability->display_order,
            ]);
        }

        return redirect()->route('admin.services.edit', $copy)->with('status', 'Service duplicated as a draft.');
    }

    public function restore(Service $service): RedirectResponse
    {
        $service->restore();
        $service->update(['is_published' => false]);

        return back()->with('status', 'Service restored as a draft.');
    }

    public function bulk(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['integer', 'distinct'],
            'action' => ['required', 'in:publish,draft,archive,restore'],
        ]);

        $services = Service::withTrashed()->whereIn('id', $data['ids'])->get();
        match ($data['action']) {
            'publish' => $services->each->update(['is_published' => true, 'published_at' => now()]),
            'draft' => $services->each->update(['is_published' => false]),
            'archive' => $services->each->delete(),
            'restore' => $services->each(function (Service $service) { $service->restore(); $service->update(['is_published' => false]); }),
        };

        return back()->with('status', 'Bulk service action completed.');
    }

    public function togglePublish(Request $request, Service $service): RedirectResponse
    {
        $published = $request->has('is_published')
            ? $request->boolean('is_published')
            : ! $service->is_published;
        $service->update([
            'is_published' => $published,
            'published_at' => $published ? now() : $service->published_at,
        ]);

        return back()->with(
            'status',
            $service->is_published ? 'Service published.' : 'Service unpublished.'
        );
    }

    /** Move one row up or down and swap the neighbour's order with it. */
    public function reorder(Request $request, Service $service): RedirectResponse
    {
        $direction = $request->string('direction')->value() === 'up' ? 'up' : 'down';

        $neighbour = Service::query()
            ->when(
                $direction === 'up',
                fn ($q) => $q->where('display_order', '<', $service->display_order)->orderByDesc('display_order'),
                fn ($q) => $q->where('display_order', '>', $service->display_order)->orderBy('display_order')
            )
            ->first();

        if ($neighbour) {
            DB::transaction(function () use ($service, $neighbour) {
                $order = $service->display_order;
                $service->update(['display_order' => $neighbour->display_order]);
                $neighbour->update(['display_order' => $order]);
            });
        }

        return back()->with('status', 'Service order updated.');
    }

    private function attributes(ServiceRequest $request, ?Service $service = null): array
    {
        return $request->safe()->except([
            'image', 'remove_image', 'social_image', 'remove_social_image', 'capabilities', 'publish_intent', 'publish_action', 'tags_text',
        ])
            + ['display_order' => $request->filled('display_order')
                ? $request->integer('display_order')
                : ($service?->display_order ?? (Service::max('display_order') ?? 0) + 1)];
    }

    /**
     * Capabilities are a short ordered list, so replacing them wholesale is
     * simpler and less error-prone than diffing rows.
     */
    private function syncCapabilities(Service $service, ServiceRequest $request): void
    {
        $rows = collect($request->input('capabilities', []))
            ->filter(fn ($row) => filled($row['label_en'] ?? null))
            ->values()
            ->map(fn ($row, $index) => [
                'label_en' => $row['label_en'],
                'label_km' => $row['label_km'] ?? null,
                'label_zh' => $row['label_zh'] ?? null,
                'display_order' => $index,
            ]);

        $service->capabilities()->delete();

        if ($rows->isNotEmpty()) {
            $service->capabilities()->createMany($rows->all());
        }
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base.'-copy';
        $suffix = 2;
        while (Service::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-copy-'.$suffix++;
        }

        return $slug;
    }
}
