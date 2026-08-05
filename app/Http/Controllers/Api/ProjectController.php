<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'featured' => ['nullable', 'boolean'],
            'service' => ['nullable', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2200'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:60'],
        ]);

        $query = Project::query()
            ->published()
            ->with('service')
            ->ordered();

        if ($request->filled('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        if ($slug = $request->string('service')->trim()->value()) {
            // Only match published services, so unpublishing a service also
            // hides its work from this filter.
            $query->whereHas(
                'service',
                fn ($q) => $q->where('slug', $slug)->where('is_published', true)
            );
        }

        if ($year = $request->integer('year')) {
            $query->where('year', $year);
        }

        if ($limit = $request->integer('limit')) {
            $query->limit($limit);
        }

        return ProjectResource::collection($query->get());
    }

    public function show(Request $request, string $slug): ProjectResource
    {
        $project = Project::query()
            ->published()
            ->with(['service', 'images', 'features'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new ProjectResource($project);
    }
}
