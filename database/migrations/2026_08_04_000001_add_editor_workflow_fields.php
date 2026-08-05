<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['services', 'projects'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->json('tags')->nullable();
                $table->string('author_name', 100)->nullable();
                $table->timestamp('published_at')->nullable()->index();
            });
        }
    }

    public function down(): void
    {
        foreach (['services', 'projects'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn(['tags', 'author_name', 'published_at']);
            });
        }
    }
};
