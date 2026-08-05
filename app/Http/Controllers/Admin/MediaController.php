<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\ImageStorage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $files = collect(Storage::disk('public')->allFiles())
            ->filter(fn (string $path) => in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'webp', 'gif'], true))
            ->map(fn (string $path) => [
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'size' => Storage::disk('public')->size($path),
                'updated_at' => Storage::disk('public')->lastModified($path),
            ])
            ->sortByDesc('updated_at')
            ->values();

        $page = max(1, $request->integer('page', 1));
        $perPage = 24;

        return Inertia::render('Admin/Media/Index', [
            'media' => $files->forPage($page, $perPage),
            'page' => $page,
            'perPage' => $perPage,
            'total' => $files->count(),
            'hasMore' => $files->forPage($page + 1, $perPage)->isNotEmpty(),
        ]);
    }

    public function store(Request $request, ImageStorage $images): JsonResponse
    {
        $validated = $request->validate([
            'image' => array_merge(ImageStorage::RULES, ['max:4096']),
        ]);

        $file = $validated['image'];
        [$width, $height] = $images->dimensions($file);
        $path = $images->store($file, 'inline');

        return response()->json([
            'url' => $images->url($path),
            'alt' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'width' => $width,
            'height' => $height,
        ], 201);
    }
}
