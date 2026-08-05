<?php

namespace App\Support;

/**
 * The locales the public site publishes, in fallback order.
 *
 * Lives on its own class rather than on the HasTranslations trait: PHP does not
 * allow reading a trait constant through the trait name, so callers outside a
 * model need a real class to reference.
 */
final class Locales
{
    public const ALL = ['en', 'km', 'zh'];

    public const FALLBACK = 'en';

    public static function normalise(?string $locale): string
    {
        return in_array($locale, self::ALL, true) ? $locale : self::FALLBACK;
    }
}
