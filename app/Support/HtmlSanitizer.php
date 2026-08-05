<?php

namespace App\Support;

use DOMAttr;
use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;

/**
 * Allow-list sanitizer for the rich-text fields written in the admin editor.
 *
 * The editor stores raw `contenteditable` HTML, which lands in the database and
 * is later re-rendered unescaped — in the admin form (`{!! !!}`) and on the
 * public Next.js site (`dangerouslySetInnerHTML`). Without a filter in between,
 * anything an editor can paste becomes stored XSS for every visitor.
 *
 * The rule here is an allow-list, never a blocklist: an element survives only
 * if its tag is named below, and an attribute survives only if it is named for
 * that tag. Anything unrecognised — `<script>`, `<iframe>`, `onerror=`,
 * `style=`, `javascript:` URLs, `<svg>` payloads — is dropped. Disallowed
 * *formatting* tags are unwrapped so their text content survives; disallowed
 * *content* tags are removed whole, so a stripped `<script>` cannot leave its
 * source code behind as visible text.
 */
class HtmlSanitizer
{
    /**
     * Tags the editor is allowed to produce, each mapped to its permitted
     * attributes. Keep this in sync with the toolbar in `admin/_editor`.
     *
     * @var array<string, list<string>>
     */
    private const ALLOWED = [
        'p' => ['style'],
        'br' => [],
        'strong' => [],
        'b' => [],
        'em' => [],
        'i' => [],
        'u' => [],
        's' => [],
        'strike' => [],
        'sub' => [],
        'sup' => [],
        'ul' => [],
        'ol' => [],
        'li' => [],
        'h2' => ['style'],
        'h3' => ['style'],
        'h4' => ['style'],
        'blockquote' => ['style'],
        'code' => [],
        'pre' => [],
        'hr' => [],
        'span' => ['class'],
        'div' => ['class', 'style'],
        'img' => ['src', 'alt', 'width', 'height'],
        'table' => [],
        'thead' => [],
        'tbody' => [],
        'tr' => [],
        'th' => ['style'],
        'td' => ['style'],
        'a' => ['href', 'title', 'target', 'rel'],
    ];

    /**
     * Elements dropped with everything inside them. For the rest, unwrapping
     * keeps the author's text; for these, the "text" is the attack.
     */
    private const DROP_WITH_CONTENT = [
        'script', 'style', 'iframe', 'object', 'embed', 'applet',
        'noscript', 'template', 'link', 'meta', 'base', 'form',
        'input', 'button', 'select', 'option', 'textarea', 'svg', 'math',
    ];

    /** URL schemes permitted in `href`. Relative URLs are also allowed. */
    private const ALLOWED_SCHEMES = ['http', 'https', 'mailto', 'tel'];

    /**
     * Return `$html` reduced to the allow-list above.
     *
     * Null and blank input come back as null so an empty editor stores a real
     * NULL rather than the `<br>` or `<p></p>` a contenteditable leaves behind.
     */
    public function clean(?string $html): ?string
    {
        if ($html === null || trim($html) === '') {
            return null;
        }

        $document = new DOMDocument;

        // Parse as a fragment: no doctype guessing, no implied <html>/<body>
        // wrapper in the output, and libxml's own warnings kept off the page.
        $previous = libxml_use_internal_errors(true);

        $loaded = $document->loadHTML(
            '<?xml encoding="UTF-8"?><div id="mpg-root">'.$html.'</div>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET
        );

        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $loaded) {
            // Unparseable markup is not worth guessing at — fall back to the
            // plain text, which is always safe to render.
            return $this->blankToNull(e(strip_tags($html)));
        }

        $root = $document->getElementById('mpg-root');

        if (! $root) {
            return null;
        }

        $this->cleanChildren($root);

        $clean = '';

        foreach ($root->childNodes as $child) {
            $clean .= $document->saveHTML($child);
        }

        return $this->blankToNull($clean);
    }

    /**
     * Apply {@see clean()} to several keys of an array, leaving keys that are
     * absent absent — so a partial update is not turned into a full one.
     *
     * @param  array<string, mixed>  $data
     * @param  list<string>  $keys
     * @return array<string, mixed>
     */
    public function cleanKeys(array $data, array $keys): array
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $data)) {
                $data[$key] = $this->clean(is_string($data[$key]) ? $data[$key] : null);
            }
        }

        return $data;
    }

    /**
     * Walk a snapshot of the child list, since sanitizing a node can replace or
     * remove it and a live NodeList would skip siblings mid-iteration.
     */
    private function cleanChildren(DOMNode $node): void
    {
        foreach (iterator_to_array($node->childNodes) as $child) {
            $this->cleanNode($child);
        }
    }

    private function cleanNode(DOMNode $node): void
    {
        // Text is escaped by the serializer on the way out, so it is safe as-is.
        if ($node instanceof DOMText) {
            return;
        }

        if (! $node instanceof DOMElement) {
            // Comments, CDATA, processing instructions: no legitimate use here,
            // and `<!--[if IE]><script>` style payloads hide in them.
            $node->parentNode?->removeChild($node);

            return;
        }

        $tag = strtolower($node->nodeName);

        if (in_array($tag, self::DROP_WITH_CONTENT, true)) {
            $node->parentNode?->removeChild($node);

            return;
        }

        // Recurse first: unwrapping below moves these children up a level, and
        // they need to have been cleaned before they land there.
        $this->cleanChildren($node);

        if (! array_key_exists($tag, self::ALLOWED)) {
            $this->unwrap($node);

            return;
        }

        $this->cleanAttributes($node, $tag);
    }

    /**
     * Strip every attribute not allowed for this tag, then re-check the ones
     * that are: an allowed name with a `javascript:` value is still an attack.
     */
    private function cleanAttributes(DOMElement $element, string $tag): void
    {
        $allowed = self::ALLOWED[$tag];

        /** @var list<DOMAttr> $attributes */
        $attributes = iterator_to_array($element->attributes);

        foreach ($attributes as $attribute) {
            if (! in_array(strtolower($attribute->nodeName), $allowed, true)) {
                $element->removeAttribute($attribute->nodeName);
            }
        }

        if ($element->hasAttribute('style')) {
            preg_match('/(?:^|;)\s*text-align\s*:\s*(left|center|right|justify)\s*(?:;|$)/i', $element->getAttribute('style'), $match);
            if (isset($match[1])) {
                $element->setAttribute('style', 'text-align:'.$match[1]);
            } else {
                $element->removeAttribute('style');
            }
        }

        if (! in_array($tag, ['a', 'img'], true)) {
            return;
        }

        $urlAttribute = $tag === 'a' ? 'href' : 'src';
        if ($element->hasAttribute($urlAttribute) && ! $this->isSafeUrl($element->getAttribute($urlAttribute))) {
            $element->removeAttribute($urlAttribute);
        }

        if ($tag === 'img') {
            foreach (['width', 'height'] as $dimension) {
                if ($element->hasAttribute($dimension) && ! ctype_digit($element->getAttribute($dimension))) {
                    $element->removeAttribute($dimension);
                }
            }

            return;
        }

        // A link opening a new tab hands the opener's `window` to the target
        // page unless it is explicitly severed.
        if (strtolower($element->getAttribute('target')) === '_blank') {
            $element->setAttribute('rel', 'noopener noreferrer');
        }
    }

    /**
     * Reject anything that is not a relative URL or one of the allowed schemes.
     *
     * The value is normalised first: browsers ignore leading control characters
     * and whitespace, so `java\tscript:alert(1)` runs even though a naive
     * prefix check would not match it.
     */
    private function isSafeUrl(string $url): bool
    {
        $normalised = strtolower(preg_replace('/[\x00-\x20]+/', '', $url) ?? '');

        if ($normalised === '') {
            return false;
        }

        // Protocol-relative and rooted/relative paths carry no scheme to abuse.
        if (str_starts_with($normalised, '/') || str_starts_with($normalised, '#')) {
            return true;
        }

        $colon = strpos($normalised, ':');

        if ($colon === false) {
            return true;
        }

        // A colon that appears after the first `/` or `?` belongs to the path
        // or query, not to a scheme (e.g. `foo/bar:baz`).
        $slash = strcspn($normalised, '/?');

        if ($colon > $slash) {
            return true;
        }

        return in_array(substr($normalised, 0, $colon), self::ALLOWED_SCHEMES, true);
    }

    /** Replace an element with its children, preserving their order. */
    private function unwrap(DOMElement $element): void
    {
        $parent = $element->parentNode;

        if (! $parent) {
            return;
        }

        foreach (iterator_to_array($element->childNodes) as $child) {
            $parent->insertBefore($child, $element);
        }

        $parent->removeChild($element);
    }

    /**
     * A contenteditable that has been typed in and cleared still serializes to
     * markup with no text in it; that should count as empty.
     */
    private function blankToNull(string $html): ?string
    {
        $text = trim(html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $text = trim(str_replace("\xc2\xa0", '', $text));

        if ($text !== '') {
            return $html;
        }

        // No text — but a bare <hr> or an <img> would still be meaningful.
        return preg_match('/<(hr|img)\b/i', $html) === 1 ? $html : null;
    }
}
