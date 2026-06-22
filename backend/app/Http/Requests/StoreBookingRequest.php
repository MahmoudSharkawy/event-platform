<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // any authenticated user can book; auth is enforced at route level
    }

    public function rules(): array
    {
        return [
            'ticket_type_id' => ['required', 'integer', 'exists:ticket_types,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:20'],
        ];
    }
}
