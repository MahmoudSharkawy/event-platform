import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";

function formatDateTime(iso) {
  if (!iso) return "Date TBA";
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EventDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    setStatus("loading");
    client
      .get(`/events/${slug}`)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setEvent(data);
        setSelectedTicketTypeId(data.ticket_types?.[0]?.id ?? null);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [slug]);

  const selectedTicketType = event?.ticket_types?.find((t) => t.id === selectedTicketTypeId);

  async function handleBook(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/events/${slug}` } });
      return;
    }
    setBookingError("");
    setBookingStatus("submitting");
    try {
      const res = await client.post("/bookings", {
        ticket_type_id: selectedTicketTypeId,
        quantity,
      });
      setConfirmedBooking(res.data.data ?? res.data);
      setBookingStatus("confirmed");
    } catch (err) {
      const messages = err.response?.data?.errors;
      setBookingError(
        messages
          ? Object.values(messages).flat().join(" ")
          : err.response?.data?.message || "Couldn't complete that booking."
      );
      setBookingStatus("idle");
    }
  }

  if (status === "loading") {
    return <p className="px-5 py-16 text-center font-mono text-sm text-mist">Loading event…</p>;
  }
  if (status === "error" || !event) {
    return (
      <p className="px-5 py-16 text-center font-mono text-sm text-velvet">
        That event couldn't be found.
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[1.4fr,1fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">
          {event.status === "cancelled" ? "Cancelled" : formatDateTime(event.starts_at)}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-stub">
          {event.title}
        </h1>
        <p className="mt-2 text-mist">
          {event.venue}
          {event.address ? ` · ${event.address}` : ""}
        </p>

        {event.organizer?.name && (
          <p className="mt-1 text-sm text-mist">Hosted by {event.organizer.name}</p>
        )}

        {event.description && (
          <p className="mt-8 whitespace-pre-line leading-relaxed text-stub/90">
            {event.description}
          </p>
        )}
      </div>

      <div className="ticket-stub h-fit p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-ink/60">
          Get tickets
        </p>

        {confirmedBooking ? (
          <div className="mt-4">
            <p className="font-display text-xl font-semibold text-paper-ink">You're in! 🎟️</p>
            <p className="mt-2 font-mono text-sm text-paper-ink/80">
              Reference: {confirmedBooking.reference}
            </p>
            <p className="mt-1 text-sm text-paper-ink/70">
              A confirmation email is on its way. See it anytime under My Tickets.
            </p>
          </div>
        ) : !event.is_bookable ? (
          <p className="mt-4 font-mono text-sm text-velvet">
            This event isn't open for booking right now.
          </p>
        ) : (
          <form onSubmit={handleBook} className="mt-4 space-y-4">
            <div className="space-y-2">
              {event.ticket_types?.map((tt) => (
                <label
                  key={tt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                    selectedTicketTypeId === tt.id
                      ? "border-velvet bg-velvet/5"
                      : "border-paper-ink/15"
                  } ${tt.sold_out ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="ticket_type"
                      disabled={tt.sold_out}
                      checked={selectedTicketTypeId === tt.id}
                      onChange={() => setSelectedTicketTypeId(tt.id)}
                    />
                    {tt.name}
                  </span>
                  <span className="font-mono">
                    {tt.sold_out ? "Sold out" : `$${tt.price}`}
                  </span>
                </label>
              ))}
            </div>

            {selectedTicketType && !selectedTicketType.sold_out && (
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wide text-paper-ink/60">
                  Quantity
                </span>
                <input
                  type="number"
                  min={1}
                  max={Math.min(20, selectedTicketType.quantity_available)}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24 rounded-lg border border-paper-ink/20 bg-transparent px-3 py-2 font-mono text-paper-ink"
                />
              </label>
            )}

            {bookingError && <p className="text-sm text-velvet">{bookingError}</p>}

            <button
              type="submit"
              disabled={bookingStatus === "submitting" || !selectedTicketType || selectedTicketType.sold_out}
              className="btn-primary w-full"
            >
              {bookingStatus === "submitting"
                ? "Booking…"
                : user
                ? "Book now"
                : "Log in to book"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
