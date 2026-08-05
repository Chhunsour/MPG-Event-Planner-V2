<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Read-only public services API.
 *
 * Every query starts from the `published` scope, so an unpublished record can
 * never be reached — not by slug, not by filter, not by id.
 */
class ServiceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'featured' => ['nullable', 'boolean'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Service::query()
            ->published()
            ->with('capabilities')
            ->ordered();

        if ($request->filled('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        if ($limit = $request->integer('limit')) {
            $query->limit($limit);
        }

        return ServiceResource::collection($query->get());
    }

    public function show(Request $request, string $slug): ServiceResource
    {
        $service = Service::query()
            ->published()
            ->with('capabilities')
            ->where('slug', $slug)
            ->firstOrFail();

        return new ServiceResource($service);
    }
}
