<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price_cents' => $this->price_cents,
            'price' => round($this->price_cents / 100, 2),
            'currency' => $this->currency,
            'quantity_total' => $this->quantity_total,
            'quantity_available' => $this->quantityAvailable(),
            'sold_out' => $this->quantityAvailable() <= 0,
        ];
    }
}
