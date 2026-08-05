<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translation_cache', function (Blueprint $table) {
            $table->id();
            $table->string('cache_key', 64)->unique();
            $table->string('target_locale', 12);
            $table->string('format', 12);
            $table->text('source_text');
            $table->longText('translated_text');
            $table->timestamps();
            $table->index(['target_locale', 'format']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translation_cache');
    }
};
