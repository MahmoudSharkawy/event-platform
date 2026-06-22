<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'venue' => $this->venue,
            'address' => $this->address,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'cover_image_url' => $this->cover_image_url,
            'status' => $this->status,
            'is_bookable' => $this->isBookable(),
            'organizer' => new UserResource($this->whenLoaded('organizer')),
            'ticket_types' => TicketTypeResource::collection($this->whenLoaded('ticketTypes')),
        ];
    }
}
