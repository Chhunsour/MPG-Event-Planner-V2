<?php

namespace App\Http\Requests\Admin\Concerns;

use App\Support\HtmlSanitizer;
use App\Support\Locales;

/**
 * Runs the rich-text fields of an admin form through {@see HtmlSanitizer}.
 *
 * Sanitizing happens in `prepareForValidation`, before the rules run, so what
 * gets length-checked, what `validated()` hands the controller, and what is
 * written to the database are all the same cleaned string — there is no path
 * that stores markup the sanitizer never saw.
 */
trait SanitizesRichText
{
    /**
     * Base names of the rich-text fields, without the locale suffix.
     *
     * @return list<string>
     */
    abstract protected function richTextFields(): array;

    protected function sanitizeRichText(): void
    {
        $sanitizer = app(HtmlSanitizer::class);
        $clean = [];

        foreach ($this->richTextFields() as $field) {
            foreach (Locales::ALL as $locale) {
                $key = "{$field}_{$locale}";

                if ($this->has($key)) {
                    $clean[$key] = $sanitizer->clean($this->input($key));
                }
            }
        }

        if ($clean !== []) {
            $this->merge($clean);
        }
    }
}
