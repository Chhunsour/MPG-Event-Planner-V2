<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('category')->nullable()->after('slug');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->string('category')->nullable()->after('slug');
            $table->json('technologies')->nullable()->after('service_id');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->string('category')->nullable()->after('excerpt_zh');
            $table->json('tags')->nullable()->after('category');
            $table->string('seo_title_en')->nullable();
            $table->string('seo_title_km')->nullable();
            $table->string('seo_title_zh')->nullable();
            $table->text('seo_description_en')->nullable();
            $table->text('seo_description_km')->nullable();
            $table->text('seo_description_zh')->nullable();
            $table->string('social_image')->nullable();
            $table->string('social_image_alt_en')->nullable();
            $table->string('social_image_alt_km')->nullable();
            $table->string('social_image_alt_zh')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('services', fn (Blueprint $table) => $table->dropColumn('category'));
        Schema::table('projects', fn (Blueprint $table) => $table->dropColumn(['category', 'technologies']));
        Schema::table('blog_posts', fn (Blueprint $table) => $table->dropColumn([
            'category', 'tags',
            'seo_title_en', 'seo_title_km', 'seo_title_zh',
            'seo_description_en', 'seo_description_km', 'seo_description_zh',
            'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
        ]));
    }
};
