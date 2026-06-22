<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'description',
        'price_cents',
        'currency',
        'quantity_total',
        'quantity_sold',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function quantityAvailable(): int
    {
        return max(0, $this->quantity_total - $this->quantity_sold);
    }

    public function isAvailable(int $quantity = 1): bool
    {
        return $this->quantityAvailable() >= $quantity;
    }
}
