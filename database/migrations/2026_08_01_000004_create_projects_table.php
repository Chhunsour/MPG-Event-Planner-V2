<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();

            $table->string('title_en');
            $table->string('title_km')->nullable();
            $table->string('title_zh')->nullable();

            $table->text('description_en')->nullable();
            $table->text('description_km')->nullable();
            $table->text('description_zh')->nullable();

            // All nullable: MPG often cannot name the client publicly, and a
            // date or location is not always known or worth publishing.
            $table->string('client_name')->nullable();
            $table->string('event_type')->nullable();
            $table->string('location')->nullable();
            $table->date('event_date')->nullable();
            $table->unsignedSmallInteger('year')->nullable();

            $table->string('cover_image')->nullable();
            $table->string('cover_image_alt_en')->nullable();
            $table->string('cover_image_alt_km')->nullable();
            $table->string('cover_image_alt_zh')->nullable();

            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();

            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'display_order']);
            $table->index(['service_id', 'is_published']);
            $table->index('year');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
