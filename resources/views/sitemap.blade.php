<?php echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n"; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($urls as $url)
    <url>
        <loc>{{ htmlspecialchars($url['loc'], ENT_XML1 | ENT_QUOTES, 'UTF-8') }}</loc>
        @if (!empty($url['lastmod']))
        <lastmod>{{ $url['lastmod'] }}</lastmod>
        @endif
        <changefreq>{{ $url['changefreq'] }}</changefreq>
        <priority>{{ $url['priority'] }}</priority>
        @foreach ($url['alternates'] as $alt)
        <xhtml:link rel="alternate" hreflang="{{ $alt['hreflang'] }}" href="{{ htmlspecialchars($alt['href'], ENT_XML1 | ENT_QUOTES, 'UTF-8') }}"/>
        @endforeach
    </url>
@endforeach
</urlset>
