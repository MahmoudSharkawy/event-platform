<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\UserResource;
use App\Models\Booking;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Basic admin overview: headline counts + revenue + recent bookings.
     */
    public function stats()
    {
        $revenueCents = Booking::where('status', 'confirmed')->sum('total_price_cents');

        return response()->json([
            'totals' => [
                'users' => User::count(),
                'events' => Event::count(),
                'published_events' => Event::where('status', 'published')->count(),
                'bookings' => Booking::where('status', 'confirmed')->count(),
                'revenue' => round($revenueCents / 100, 2),
            ],
            'recent_bookings' => BookingResource::collection(
                Booking::with(['event', 'ticketType', 'user'])->latest()->limit(10)->get()
            ),
        ]);
    }

    public function users()
    {
        return UserResource::collection(User::orderBy('name')->paginate(20));
    }

    public function updateUserRole(\Illuminate\Http\Request $request, User $user)
    {
        $data = $request->validate([
            'role' => ['required', 'in:attendee,organizer,admin'],
        ]);

        $user->update($data);

        return new UserResource($user);
    }
}
