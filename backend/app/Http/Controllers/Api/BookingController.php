<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Mail\BookingConfirmed;
use App\Models\Booking;
use App\Models\TicketType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    /**
     * Book tickets for an event. Wrapped in a DB transaction with a
     * row lock on the ticket type so concurrent bookings can never
     * oversell the same inventory.
     */
    public function store(StoreBookingRequest $request)
    {
        $data = $request->validated();

        $booking = DB::transaction(function () use ($data, $request) {
            /** @var TicketType $ticketType */
            $ticketType = TicketType::query()
                ->where('id', $data['ticket_type_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $event = $ticketType->event;

            if (! $event->isBookable()) {
                throw ValidationException::withMessages([
                    'ticket_type_id' => 'This event is not currently open for booking.',
                ]);
            }

            if (! $ticketType->isAvailable($data['quantity'])) {
                throw ValidationException::withMessages([
                    'quantity' => 'Not enough tickets available. Only '.$ticketType->quantityAvailable().' left.',
                ]);
            }

            $ticketType->increment('quantity_sold', $data['quantity']);

            return Booking::create([
                'user_id' => $request->user()->id,
                'event_id' => $event->id,
                'ticket_type_id' => $ticketType->id,
                'quantity' => $data['quantity'],
                'total_price_cents' => $ticketType->price_cents * $data['quantity'],
                'currency' => $ticketType->currency,
                'status' => 'confirmed',
            ]);
        });

        $booking->load(['event', 'ticketType']);

        // Queued so the request doesn't block on SMTP.
        Mail::to($request->user()->email)->queue(new BookingConfirmed($booking));

        return new BookingResource($booking);
    }

    public function index(\Illuminate\Http\Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with(['event', 'ticketType'])
            ->latest()
            ->paginate(10);

        return BookingResource::collection($bookings);
    }

    public function show(\Illuminate\Http\Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'You do not have permission to view this booking.'], 403);
        }

        return new BookingResource($booking->load(['event', 'ticketType']));
    }

    public function destroy(\Illuminate\Http\Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            return response()->json(['message' => 'You do not have permission to cancel this booking.'], 403);
        }

        DB::transaction(function () use ($booking) {
            if ($booking->status === 'confirmed') {
                $booking->ticketType()->decrement('quantity_sold', $booking->quantity);
            }
            $booking->update(['status' => 'cancelled']);
        });

        return new BookingResource($booking->fresh(['event', 'ticketType']));
    }
}
