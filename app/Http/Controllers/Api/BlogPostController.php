<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Read-only public blog API.
 *
 * Only published posts with a published_at date in the past are returned.
 */
class BlogPostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = BlogPost::query()
            ->published()
            ->ordered();

        if ($limit = $request->integer('limit')) {
            $query->limit($limit);
        }

        return BlogPostResource::collection($query->get());
    }

    public function show(Request $request, string $slug): BlogPostResource
    {
        $post = BlogPost::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return new BlogPostResource($post);
    }
}
