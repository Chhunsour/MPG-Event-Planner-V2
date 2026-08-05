<?php

namespace App\Support;

/**
 * Per-column translations with an English fallback.
 *
 * Translated fields are stored as sibling columns (`title_en`, `title_km`,
 * `title_zh`). English is required at the validation layer; Khmer and Chinese
 * are optional so staff can publish before translations are ready. Asking for a
 * locale that has not been filled in returns the English value rather than an
 * empty string, so the public site never renders a blank heading.
 */
trait HasTranslations
{
    public function translate(string $field, ?string $locale = null): ?string
    {
        $locale = $this->normaliseLocale($locale);

        $value = $this->getAttribute("{$field}_{$locale}");

        return filled($value) ? $value : $this->getAttribute("{$field}_en");
    }

    /**
     * All locales for a field, each already resolved through the fallback.
     *
     * @return array<string, string|null>
     */
    public function translations(string $field): array
    {
        $out = [];
        foreach (Locales::ALL as $locale) {
            $out[$locale] = $this->translate($field, $locale);
        }

        return $out;
    }

    /** True when this locale has its own value rather than the English one. */
    public function hasTranslation(string $field, string $locale): bool
    {
        return filled($this->getAttribute("{$field}_{$this->normaliseLocale($locale)}"));
    }

    private function normaliseLocale(?string $locale): string
    {
        return Locales::normalise($locale ?: app()->getLocale());
    }
}
