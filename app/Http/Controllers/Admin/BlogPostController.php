<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogPostRequest;
use App\Models\BlogPost;
use App\Support\ImageStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    public function __construct(private readonly ImageStorage $images) {}

    public function index(Request $request): Response
    {
        $status = $request->string('status')->trim()->value();
        $query = BlogPost::query();
        if ($status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->when($status === 'published', fn ($q) => $q->published())
                ->when($status === 'scheduled', fn ($q) => $q->where('is_published', true)->where('published_at', '>', now()))
                ->when($status === 'draft', fn ($q) => $q->where('is_published', false));
        }

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $query
                ->when($request->filled('q'), function ($query) use ($request) {
                    $term = '%'.$request->string('q')->trim().'%';
                    $query->where(fn ($q) => $q
                        ->where('title_en', 'like', $term)
                        ->orWhere('title_km', 'like', $term)
                        ->orWhere('title_zh', 'like', $term)
                        ->orWhere('excerpt_en', 'like', $term)
                        ->orWhere('category', 'like', $term)
                        ->orWhere('author_name', 'like', $term));
                })
                ->when($request->filled('language'), function ($query) use ($request) {
                    $language = $request->string('language')->trim()->value();
                    if (in_array($language, ['km', 'zh'], true)) {
                        $query->whereNotNull("title_{$language}")->where("title_{$language}", '!=', '');
                    }
                })
                ->orderByDesc('published_at')->orderByDesc('id')
                ->paginate(20)
                ->withQueryString(),
            'status' => $status,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => [
                ...new BlogPost([
                    'is_published' => false,
                    'display_order' => (BlogPost::max('display_order') ?? 0) + 1,
                    'author_name' => auth()->user()?->name ?? auth()->user()?->email,
                ])->toArray(),
                'exists' => false,
            ],
        ]);
    }

    public function store(BlogPostRequest $request): RedirectResponse
    {
        $post = DB::transaction(function () use ($request) {
            $post = BlogPost::create($this->attributes($request));

            if ($request->hasFile('cover_image')) {
                $post->update([
                    'cover_image' => $this->images->store($request->file('cover_image'), 'blog'),
                ]);
            }

            if ($request->hasFile('social_image')) {
                $post->update(['social_image' => $this->images->store($request->file('social_image'), 'blog/social')]);
            }

            return $post;
        });

        return redirect()
            ->route('admin.blog.edit', $post)
            ->with('status', 'Blog post created.');
    }

    public function edit(BlogPost $blog): Response
    {
        return Inertia::render('Admin/Blog/Form', [
            'post' => [...$blog->toArray(), 'exists' => true],
        ]);
    }

    public function update(BlogPostRequest $request, BlogPost $blog): RedirectResponse
    {
        DB::transaction(function () use ($request, $blog) {
            $blog->update($this->attributes($request, $blog));

            if ($request->hasFile('cover_image')) {
                $previous = $blog->cover_image;
                $blog->update(['cover_image' => $this->images->store($request->file('cover_image'), 'blog')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_cover_image')) {
                $previous = $blog->cover_image;
                $blog->update(['cover_image' => null]);
                $this->images->delete($previous);
            }

            if ($request->hasFile('social_image')) {
                $previous = $blog->social_image;
                $blog->update(['social_image' => $this->images->store($request->file('social_image'), 'blog/social')]);
                $this->images->delete($previous);
            } elseif ($request->boolean('remove_social_image')) {
                $previous = $blog->social_image;
                $blog->update(['social_image' => null]);
                $this->images->delete($previous);
            }
        });

        return redirect()
            ->route('admin.blog.edit', $blog)
            ->with('status', 'Blog post saved.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $blog->delete();

        return redirect()
            ->route('admin.blog.index')
            ->with('status', 'Blog post deleted.');
    }

    public function duplicate(BlogPost $blog): RedirectResponse
    {
        $copy = $blog->replicate();
        $copy->title_en = 'Copy of '.$blog->title_en;
        $copy->slug = $this->uniqueSlug($blog->slug);
        $copy->is_published = false;
        $copy->published_at = null;
        $copy->save();

        return redirect()->route('admin.blog.edit', $copy)->with('status', 'Blog post duplicated as a draft.');
    }

    public function restore(BlogPost $blog): RedirectResponse
    {
        $blog->restore();
        $blog->update(['is_published' => false]);

        return back()->with('status', 'Blog post restored as a draft.');
    }

    public function bulk(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1', 'max:100'],
            'ids.*' => ['integer', 'distinct'],
            'action' => ['required', 'in:publish,draft,archive,restore'],
        ]);

        $posts = BlogPost::withTrashed()->whereIn('id', $data['ids'])->get();
        match ($data['action']) {
            'publish' => $posts->each(function (BlogPost $post) {
                $post->update(['is_published' => true, 'published_at' => now()]);
            }),
            'draft' => $posts->each->update(['is_published' => false]),
            'archive' => $posts->each->delete(),
            'restore' => $posts->each(function (BlogPost $post) { $post->restore(); $post->update(['is_published' => false]); }),
        };

        return back()->with('status', 'Bulk blog action completed.');
    }

    public function togglePublish(Request $request, BlogPost $blog): RedirectResponse
    {
        $published = $request->has('is_published')
            ? $request->boolean('is_published')
            : ! $blog->is_published;
        $blog->update([
            'is_published' => $published,
            'published_at' => $published && ! $blog->published_at
                ? now()
                : $blog->published_at,
        ]);

        return back()->with(
            'status',
            $blog->is_published ? 'Blog post published.' : 'Blog post unpublished.'
        );
    }

    private function attributes(BlogPostRequest $request, ?BlogPost $post = null): array
    {
        return $request->safe()->except([
            'cover_image', 'remove_cover_image', 'social_image', 'remove_social_image', 'tags_text', 'publish_intent', 'publish_action',
        ])
            + ['display_order' => $request->filled('display_order')
                ? $request->integer('display_order')
                : ($post?->display_order ?? (BlogPost::max('display_order') ?? 0) + 1)];
    }

    private function uniqueSlug(string $base): string
    {
        $slug = $base.'-copy';
        $suffix = 2;
        while (BlogPost::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base.'-copy-'.$suffix++;
        }

        return $slug;
    }
}
