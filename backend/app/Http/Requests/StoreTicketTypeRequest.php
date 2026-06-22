<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $event = $this->route('event');

        return $this->user()->isAdmin() || $this->user()->id === $event->organizer_id;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_cents' => ['required', 'integer', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'quantity_total' => ['required', 'integer', 'min:1'],
        ];
    }
}
