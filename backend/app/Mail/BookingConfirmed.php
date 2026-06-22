<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Booking $booking)
    {
    }

    public function build()
    {
        return $this
            ->subject("You're confirmed: {$this->booking->event->title}")
            ->view('emails.booking-confirmed')
            ->with([
                'booking' => $this->booking,
                'event' => $this->booking->event,
                'ticketType' => $this->booking->ticketType,
            ]);
    }
}
