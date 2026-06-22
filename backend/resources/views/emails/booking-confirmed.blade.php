<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking confirmed</title>
</head>
<body style="margin:0; padding:0; background:#14171F; font-family: -apple-system, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 16px;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#FBF7EE; border-radius:12px; overflow:hidden;">
                    <tr>
                        <td style="background:#14171F; padding:24px 32px;">
                            <span style="color:#F2B544; font-size:13px; letter-spacing:2px; text-transform:uppercase;">Ticket Confirmed</span>
                            <h1 style="color:#FBF7EE; font-size:22px; margin:8px 0 0;">{{ $event->title }}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="color:#14171F; font-size:15px; line-height:1.5;">
                                Hi {{ $booking->user->name }}, your booking is confirmed. Here are the details:
                            </p>

                            <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:16px; border-top:1px dashed #8A8F9C; border-bottom:1px dashed #8A8F9C;">
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px;">Reference</td>
                                    <td align="right" style="font-family: 'Courier New', monospace; font-size:15px; color:#14171F;">{{ $booking->reference }}</td>
                                </tr>
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px;">Venue</td>
                                    <td align="right" style="font-size:14px; color:#14171F;">{{ $event->venue }}</td>
                                </tr>
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px;">Date</td>
                                    <td align="right" style="font-size:14px; color:#14171F;">{{ $event->starts_at->format('D, M j, Y \a\t g:ia') }}</td>
                                </tr>
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px;">Ticket type</td>
                                    <td align="right" style="font-size:14px; color:#14171F;">{{ $ticketType->name }}</td>
                                </tr>
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px;">Quantity</td>
                                    <td align="right" style="font-size:14px; color:#14171F;">{{ $booking->quantity }}</td>
                                </tr>
                                <tr>
                                    <td style="color:#8A8F9C; font-size:13px; padding-bottom:16px;">Total</td>
                                    <td align="right" style="font-family: 'Courier New', monospace; font-size:16px; color:#14171F; padding-bottom:16px;">
                                        {{ $booking->currency }} {{ number_format($booking->total_price_cents / 100, 2) }}
                                    </td>
                                </tr>
                            </table>

                            <p style="color:#8A8F9C; font-size:12px; margin-top:24px;">
                                Keep this email as your proof of booking. Present your reference code at the door.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
