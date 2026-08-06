<?php

namespace App\Support;

use App\Support\SiteSettings;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Image uploads for the admin dashboard.
 *
 * Automatically converts all uploaded JPG, PNG, GIF, and WebP images to .webp format
 * with optimal compression (82% quality), returning size savings statistics.
 */
class ImageStorage
{
    /** Validation shared by every image field in the admin. */
    public const RULES = [
        'image',
        'mimes:jpg,jpeg,png,webp,gif',
        'mimetypes:image/jpeg,image/png,image/webp,image/gif',
    ];

    public function __construct(private readonly string $disk = 'public') {}

    /**
     * Store an upload under `directory`, auto-converting it to WebP.
     * Returns relative path to the converted .webp file.
     */
    public function store(UploadedFile $file, string $directory): string
    {
        $result = $this->storeWebp($file, $directory);

        // Flash WebP data savings message to session status toast
        if (function_exists('session')) {
            $existing = session('status', '');
            $statusText = $existing ? "{$existing} · {$result['message']}" : $result['message'];
            session()->flash('status', $statusText);
        }

        return $result['path'];
    }

    /**
     * Convert uploaded image to WebP format and compute file compression statistics.
     *
     * @return array{path: string, original_size: int, webp_size: int, bytes_saved: int, percent_saved: float, message: string}
     */
    public function storeWebp(UploadedFile $file, string $directory): array
    {
        $originalSize = $file->getSize();
        $tempPath = $file->getRealPath();
        $mime = $file->getMimeType();

        // Create GD image resource based on mime type
        $image = match ($mime) {
            'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($tempPath),
            'image/png' => @imagecreatefrompng($tempPath),
            'image/gif' => @imagecreatefromgif($tempPath),
            'image/webp' => @imagecreatefromwebp($tempPath),
            default => null,
        };

        $filename = Str::ulid().'.webp';
        $relativeTarget = "{$directory}/{$filename}";
        $fullTargetPath = Storage::disk($this->disk)->path($relativeTarget);

        // Ensure parent directory exists
        $targetDir = dirname($fullTargetPath);
        if (! is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        if ($image !== false && $image !== null) {
            // Preserve PNG/GIF alpha transparency
            imagealphablending($image, true);
            imagesavealpha($image, true);

            // Read user-configured WebP compression quality setting (default 82%)
            $quality = (int) SiteSettings::get('webp_quality', 82);
            $quality = max(50, min(100, $quality));

            // Convert to WebP with configured quality
            imagewebp($image, $fullTargetPath, $quality);
            imagedestroy($image);
        } else {
            // Fallback: move file directly if GD conversion is unsupported
            Storage::disk($this->disk)->putFileAs($directory, $file, $filename);
        }

        $webpSize = file_exists($fullTargetPath) ? filesize($fullTargetPath) : $originalSize;
        $bytesSaved = max(0, $originalSize - $webpSize);
        $percentSaved = $originalSize > 0 ? round(($bytesSaved / $originalSize) * 100, 1) : 0;

        $formattedOriginal = $this->formatBytes($originalSize);
        $formattedWebp = $this->formatBytes($webpSize);

        $message = "⚡ Auto-converted to WebP: {$formattedOriginal} ➔ {$formattedWebp} ({$percentSaved}% data saved)";

        return [
            'path' => $relativeTarget,
            'original_size' => $originalSize,
            'webp_size' => $webpSize,
            'bytes_saved' => $bytesSaved,
            'percent_saved' => $percentSaved,
            'message' => $message,
        ];
    }

    public function delete(?string $path): void
    {
        if ($path && ! $this->isReferenced($path) && Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }
    }

    /**
     * Never remove a file while a database row still points at it.
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

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 1) . ' KB';
        }

        return $bytes . ' B';
    }
}
