import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

function formatDateTime(iso) {
  if (!iso) return "Date TBA";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("loading");

  function load() {
    setStatus("loading");
    client
      .get("/my/bookings")
      .then((res) => {
        setBookings(res.data.data ?? res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }

  useEffect(load, []);

  async function cancelBooking(id) {
    if (!confirm("Cancel this booking? This can't be undone.")) return;
    await client.delete(`/bookings/${id}`);
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Your tickets</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-stub">My Bookings</h1>

      {status === "loading" && <p className="mt-8 font-mono text-sm text-mist">Loading…</p>}
      {status === "error" && (
        <p className="mt-8 font-mono text-sm text-velvet">Couldn't load your bookings.</p>
      )}
      {status === "ready" && bookings.length === 0 && (
        <p className="mt-8 text-mist">
          No bookings yet.{" "}
          <Link to="/" className="text-marquee hover:text-marquee-soft">
            Browse events
          </Link>
          .
        </p>
      )}

      <div className="mt-8 space-y-5">
        {bookings.map((b) => (
          <div key={b.id} className="ticket-stub grid grid-cols-[1fr,auto]">
            <div className="p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-velvet">
                {b.status === "cancelled" ? "Cancelled" : formatDateTime(b.event?.starts_at)}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-paper-ink">
                {b.event?.title}
              </h3>
              <p className="mt-1 text-sm text-paper-ink/70">
                {b.ticket_type?.name} × {b.quantity}
              </p>
              <p className="mt-1 font-mono text-xs text-paper-ink/50">Ref {b.reference}</p>

              {b.status === "confirmed" && (
                <button
                  onClick={() => cancelBooking(b.id)}
                  className="mt-3 font-mono text-xs uppercase tracking-wide text-velvet hover:underline"
                >
                  Cancel booking
                </button>
              )}
            </div>
            <div className="ticket-stub__perf flex min-w-[110px] flex-col items-center justify-center p-5 text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-paper-ink/50">
                Total
              </span>
              <span className="font-mono text-lg font-semibold text-paper-ink">
                ${b.total_price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
