<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'MPG Event Planner') }}</title>

        <link rel="icon" type="image/png" href="/images/mpg-favicon.png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.cdnfonts.com/css/google-sans" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Battambang:wght@400;700;900&family=Noto+Sans+Khmer:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="{{ app()->getLocale() === 'km' ? 'font-km' : (app()->getLocale() === 'zh' ? 'font-zh' : 'font-en') }} bg-paper text-ink-text antialiased">
        @inertia
    </body>
</html>
