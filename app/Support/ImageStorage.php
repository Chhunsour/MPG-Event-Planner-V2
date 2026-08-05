<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Image uploads for the admin dashboard.
 *
 * Files live on the `public` disk; MySQL only ever holds the relative path.
 * Filenames are generated, never taken from the upload, so a crafted name
 * cannot traverse directories or smuggle a second extension past the server.
 */
class ImageStorage
{
    /** Validation shared by every image field in the admin. */
    public const RULES = [
        'image',
        'mimes:jpg,jpeg,png,webp',
        'mimetypes:image/jpeg,image/png,image/webp',
    ];

    public function __construct(private readonly string $disk = 'public') {}

    /**
     * Store an upload under `directory` and return its relative path.
     */
    public function store(UploadedFile $file, string $directory): string
    {
        $extension = strtolower($file->extension() ?: $file->getClientOriginalExtension());
        $name = Str::ulid().'.'.$extension;

        return $file->storeAs($directory, $name, ['disk' => $this->disk]);
    }

    public function delete(?string $path): void
    {
        if ($path && ! $this->isReferenced($path) && Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }
    }

    /**
     * A cover can deliberately share a gallery image, and legacy seed content
     * may share files with another content type. Never remove a file while a
     * database row still points at it.
     */
    private function isReferenced(string $path): bool
    {
        foreach ([
            ['services', 'image'],
            ['services', 'social_image'],
            ['projects', 'cover_image'],
            ['projects', 'social_image'],
            ['project_images', 'path'],
            ['blog_posts', 'cover_image'],
            ['blog_posts', 'social_image'],
        ] as [$table, $column]) {
            if (DB::table($table)->where($column, $path)->exists()) {
                return true;
            }
        }

        return false;
    }

    /** Absolute URL for the public site. */
    public function url(?string $path): ?string
    {
        return $path ? Storage::disk($this->disk)->url($path) : null;
    }

    /** @return array{0: int|null, 1: int|null} width and height */
    public function dimensions(UploadedFile $file): array
    {
        $size = @getimagesize($file->getRealPath());

        return [$size[0] ?? null, $size[1] ?? null];
    }
}
