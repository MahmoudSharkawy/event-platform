<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'user_id',
        'event_id',
        'ticket_type_id',
        'quantity',
        'total_price_cents',
        'currency',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->reference)) {
                do {
                    $reference = strtoupper(Str::random(8));
                } while (static::where('reference', $reference)->exists());
                $booking->reference = $reference;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function ticketType()
    {
        return $this->belongsTo(TicketType::class);
    }
}
