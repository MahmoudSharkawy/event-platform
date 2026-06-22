<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    /**
     * Public event listing. Only published, upcoming events by default.
     * Organizers/admins can pass ?mine=1 to see their own events in any status.
     */
    public function index(Request $request)
    {
        $query = Event::query()->with(['organizer', 'ticketTypes']);

        if ($request->boolean('mine') && $request->user()) {
            $query->where('organizer_id', $request->user()->id);
        } else {
            $query->published()->where('starts_at', '>=', now());
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        $events = $query->orderBy('starts_at')->paginate(12);

        return EventResource::collection($events);
    }

    public function show(Event $event)
    {
        // Non-published events are only visible to their organizer or an admin.
        $user = request()->user();
        if ($event->status !== 'published' && (! $user || (! $user->isAdmin() && $user->id !== $event->organizer_id))) {
            abort(404);
        }

        return new EventResource($event->load(['organizer', 'ticketTypes']));
    }

    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();

        $event = DB::transaction(function () use ($data, $request) {
            $event = Event::create([
                'organizer_id' => $request->user()->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'venue' => $data['venue'],
                'address' => $data['address'] ?? null,
                'starts_at' => $data['starts_at'],
                'ends_at' => $data['ends_at'] ?? null,
                'cover_image_url' => $data['cover_image_url'] ?? null,
                'status' => $data['status'] ?? 'draft',
            ]);

            foreach ($data['ticket_types'] ?? [] as $ticketType) {
                $event->ticketTypes()->create([
                    'name' => $ticketType['name'],
                    'description' => $ticketType['description'] ?? null,
                    'price_cents' => $ticketType['price_cents'],
                    'currency' => $ticketType['currency'] ?? 'USD',
                    'quantity_total' => $ticketType['quantity_total'],
                ]);
            }

            return $event;
        });

        return new EventResource($event->load(['organizer', 'ticketTypes']));
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $event->update($request->validated());

        return new EventResource($event->load(['organizer', 'ticketTypes']));
    }

    public function destroy(Request $request, Event $event)
    {
        if (! $request->user()->isAdmin() && $request->user()->id !== $event->organizer_id) {
            return response()->json(['message' => 'You do not have permission to perform this action.'], 403);
        }

        $event->delete();

        return response()->json(null, 204);
    }
}
