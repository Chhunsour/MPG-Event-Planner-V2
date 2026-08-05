<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();

            // English is the source of truth; km/zh fall back to it when empty.
            $table->string('title_en');
            $table->string('title_km')->nullable();
            $table->string('title_zh')->nullable();

            $table->string('short_description_en', 500)->nullable();
            $table->string('short_description_km', 500)->nullable();
            $table->string('short_description_zh', 500)->nullable();

            $table->text('description_en')->nullable();
            $table->text('description_km')->nullable();
            $table->text('description_zh')->nullable();

            // Relative path within the public disk. Never the file itself.
            $table->string('image')->nullable();
            $table->string('image_alt_en')->nullable();
            $table->string('image_alt_km')->nullable();
            $table->string('image_alt_zh')->nullable();

            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'display_order']);
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
