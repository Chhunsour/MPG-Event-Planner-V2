<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 160)->unique();

            // Multilingual content
            $table->string('title_en');
            $table->string('title_km')->nullable();
            $table->string('title_zh')->nullable();

            $table->string('excerpt_en', 500)->nullable();
            $table->string('excerpt_km', 500)->nullable();
            $table->string('excerpt_zh', 500)->nullable();

            $table->text('body_en')->nullable();
            $table->text('body_km')->nullable();
            $table->text('body_zh')->nullable();

            // Cover image
            $table->string('cover_image')->nullable();
            $table->string('cover_image_alt_en')->nullable();
            $table->string('cover_image_alt_km')->nullable();
            $table->string('cover_image_alt_zh')->nullable();

            // SEO
            $table->string('meta_description_en', 320)->nullable();
            $table->string('meta_description_km', 320)->nullable();
            $table->string('meta_description_zh', 320)->nullable();

            // Metadata
            $table->string('author_name')->nullable();
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index(['is_published', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
