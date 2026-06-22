<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        $event = $this->route('event');

        return $this->user()->isAdmin() || $this->user()->id === $event->organizer_id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'venue' => ['sometimes', 'required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'cover_image_url' => ['nullable', 'url'],
            'status' => ['nullable', 'in:draft,published,cancelled'],
        ];
    }
}
