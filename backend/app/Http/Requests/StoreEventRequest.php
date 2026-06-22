<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isOrganizer();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'venue' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['required', 'date', 'after:now'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'cover_image_url' => ['nullable', 'url'],
            'status' => ['nullable', 'in:draft,published,cancelled'],
            'ticket_types' => ['nullable', 'array'],
            'ticket_types.*.name' => ['required_with:ticket_types', 'string', 'max:255'],
            'ticket_types.*.price_cents' => ['required_with:ticket_types', 'integer', 'min:0'],
            'ticket_types.*.quantity_total' => ['required_with:ticket_types', 'integer', 'min:1'],
        ];
    }
}
