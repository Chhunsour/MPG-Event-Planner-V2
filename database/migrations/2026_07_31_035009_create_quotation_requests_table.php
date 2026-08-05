<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quotation_requests', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->string('company_name')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->string('preferred_contact_method');
            $table->string('event_type');
            $table->date('event_date')->nullable();
            $table->string('event_location');
            $table->string('estimated_guests')->nullable();
            $table->string('estimated_budget')->nullable();
            $table->json('required_services')->nullable();
            $table->text('additional_information')->nullable();
            $table->string('language', 10)->default('en');
            $table->string('status', 30)->default('new');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_requests');
    }
};
