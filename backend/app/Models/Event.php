<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'title',
        'slug',
        'description',
        'venue',
        'address',
        'starts_at',
        'ends_at',
        'cover_image_url',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Event $event) {
            if (empty($event->slug)) {
                $base = Str::slug($event->title);
                $slug = $base;
                $i = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$base}-{$i}";
                    $i++;
                }
                $event->slug = $slug;
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function isBookable(): bool
    {
        return $this->status === 'published' && $this->starts_at->isFuture();
    }
}
