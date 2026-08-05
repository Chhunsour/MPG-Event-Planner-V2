<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('status');
            $table->timestamp('resolved_at')->nullable()->after('status_changed_at');
            $table->index(['is_read', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->dropIndex(['is_read', 'created_at']);
            $table->dropColumn(['is_read', 'resolved_at']);
        });
    }
};
