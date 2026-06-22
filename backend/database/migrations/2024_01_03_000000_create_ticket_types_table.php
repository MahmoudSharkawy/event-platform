<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('name'); // e.g. "General Admission", "VIP"
            $table->text('description')->nullable();
            $table->unsignedInteger('price_cents')->default(0);
            $table->string('currency', 3)->default('USD');
            $table->unsignedInteger('quantity_total');
            $table->unsignedInteger('quantity_sold')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_types');
    }
};
