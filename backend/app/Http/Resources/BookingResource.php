<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'quantity' => $this->quantity,
            'total_price_cents' => $this->total_price_cents,
            'total_price' => round($this->total_price_cents / 100, 2),
            'currency' => $this->currency,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'event' => new EventResource($this->whenLoaded('event')),
            'ticket_type' => new TicketTypeResource($this->whenLoaded('ticketType')),
        ];
    }
}
