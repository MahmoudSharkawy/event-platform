<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketTypeRequest;
use App\Http\Resources\TicketTypeResource;
use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketTypeController extends Controller
{
    public function store(StoreTicketTypeRequest $request, Event $event)
    {
        $ticketType = $event->ticketTypes()->create($request->validated());

        return new TicketTypeResource($ticketType);
    }

    public function update(Request $request, Event $event, TicketType $ticketType)
    {
        if (! $request->user()->isAdmin() && $request->user()->id !== $event->organizer_id) {
            return response()->json(['message' => 'You do not have permission to perform this action.'], 403);
        }

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_cents' => ['sometimes', 'required', 'integer', 'min:0'],
            'quantity_total' => ['sometimes', 'required', 'integer', 'min:1'],
        ]);

        $ticketType->update($data);

        return new TicketTypeResource($ticketType);
    }

    public function destroy(Request $request, Event $event, TicketType $ticketType)
    {
        if (! $request->user()->isAdmin() && $request->user()->id !== $event->organizer_id) {
            return response()->json(['message' => 'You do not have permission to perform this action.'], 403);
        }

        $ticketType->delete();

        return response()->json(null, 204);
    }
}
