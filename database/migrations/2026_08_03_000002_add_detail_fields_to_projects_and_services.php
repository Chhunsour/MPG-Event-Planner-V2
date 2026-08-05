<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->text('short_description_en')->nullable()->after('description_zh');
            $table->text('short_description_km')->nullable()->after('short_description_en');
            $table->text('short_description_zh')->nullable()->after('short_description_km');
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

        Schema::table('services', function (Blueprint $table) {
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
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'short_description_en', 'short_description_km', 'short_description_zh',
                'seo_title_en', 'seo_title_km', 'seo_title_zh',
                'seo_description_en', 'seo_description_km', 'seo_description_zh',
                'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
            ]);
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'seo_title_en', 'seo_title_km', 'seo_title_zh',
                'seo_description_en', 'seo_description_km', 'seo_description_zh',
                'social_image', 'social_image_alt_en', 'social_image_alt_km', 'social_image_alt_zh',
            ]);
        });
    }
};
