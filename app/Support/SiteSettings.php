<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class SiteSettings
{
    private const FILE = 'settings.json';

    public static function get(string $key, mixed $default = null): mixed
    {
        $all = self::all();

        return $all[$key] ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        $all = self::all();
        $all[$key] = $value;
        Storage::disk('local')->put(self::FILE, json_encode($all, JSON_PRETTY_PRINT));
    }

    public static function setMany(array $settings): void
    {
        $all = array_merge(self::all(), $settings);
        Storage::disk('local')->put(self::FILE, json_encode($all, JSON_PRETTY_PRINT));
    }

    public static function all(): array
    {
        if (! Storage::disk('local')->exists(self::FILE)) {
            return [
                'webp_quality' => 82,
                'company_name' => 'MPG Event Planner',
                'company_email' => 'contact@mpgeventplanner.com',
                'company_phone' => '+855 12 345 678',
                'company_address' => 'Phnom Penh, Cambodia',
                'telegram' => '@mpgeventplanner',
                'facebook' => 'https://facebook.com/mpgeventplanner',
                'instagram' => '@mpgeventplanner',
                'default_lang' => 'en',
            ];
        }

        $content = Storage::disk('local')->get(self::FILE);
        $decoded = json_decode($content, true);

        return is_array($decoded) ? $decoded + ['webp_quality' => 82] : ['webp_quality' => 82];
    }
}
