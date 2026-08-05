<?php

namespace App\Http\Requests\Admin\Concerns;

use Illuminate\Support\Str;

trait PreparesContentEditor
{
    /**
     * Resolve the four editor actions while retaining the old is_published and
     * publish_intent inputs for API and test compatibility.
     *
     * @return array{is_published: bool, published_at: mixed}
     */
    protected function publishingValues(mixed $currentPublishedAt = null): array
    {
        $action = $this->string('publish_action')->value();
        $hasLegacyIntent = $this->has('publish_intent') && $this->input('publish_intent') !== '';

        $published = match ($action) {
            'publish', 'schedule' => true,
            'draft' => false,
            default => $hasLegacyIntent
                ? $this->boolean('publish_intent')
                : $this->boolean('is_published'),
        };

        $publishedAt = $this->input('published_at') ?: $currentPublishedAt;
        if ($action === 'publish') {
            $publishedAt = now();
        } elseif ($published && blank($publishedAt)) {
            $publishedAt = now();
        }

        return ['is_published' => $published, 'published_at' => $publishedAt];
    }

    /** @return list<string> */
    protected function editorTags(string ...$sources): array
    {
        $manual = collect(explode(',', (string) $this->input('tags_text', '')))
            ->map(fn ($value) => trim($value))
            ->filter()
            ->unique(fn ($value) => Str::lower($value))
            ->take(24)
            ->values();

        if ($manual->isNotEmpty()) {
            return $manual->all();
        }

        $stopWords = [
            'about', 'after', 'also', 'and', 'are', 'been', 'before', 'but',
            'can', 'event', 'for', 'from', 'have', 'into', 'more', 'our',
            'that', 'the', 'their', 'this', 'through', 'with', 'your',
        ];

        $words = preg_split(
            '/[^\pL\pN]+/u',
            Str::lower(strip_tags(implode(' ', $sources))),
            -1,
            PREG_SPLIT_NO_EMPTY,
        ) ?: [];

        return collect($words)
            ->filter(fn ($word) => mb_strlen($word) >= 4 && ! in_array($word, $stopWords, true))
            ->countBy()
            ->sortDesc()
            ->keys()
            ->take(8)
            ->values()
            ->all();
    }

    protected function editorAuthor(): ?string
    {
        return $this->string('author_name')->trim()->value()
            ?: $this->user()?->name
            ?: $this->user()?->email;
    }

    protected function generated(string $input, mixed $fallback): mixed
    {
        return filled($this->input($input)) ? $this->input($input) : $fallback;
    }
}
