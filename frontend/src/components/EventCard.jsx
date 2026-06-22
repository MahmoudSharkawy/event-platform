import { Link } from "react-router-dom";

function formatDate(iso) {
  if (!iso) return "TBA";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export default function EventCard({ event }) {
  const cheapest = [...(event.ticket_types || [])].sort(
    (a, b) => a.price_cents - b.price_cents
  )[0];
  const soldOut =
    event.ticket_types?.length > 0 &&
    event.ticket_types.every((t) => t.sold_out);

  return (
    <Link
      to={`/events/${event.slug}`}
      className="ticket-stub group grid grid-cols-[1fr,auto] shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 sm:grid-cols-1"
    >
      <div className="p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-velvet">
          {formatDate(event.starts_at)} · {formatTime(event.starts_at)}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold leading-snug text-paper-ink">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-paper-ink/70">{event.venue}</p>
      </div>

      <div className="ticket-stub__perf flex min-w-[110px] flex-col items-center justify-center gap-1 p-5 text-center">
        {soldOut ? (
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-velvet">
            Sold Out
          </span>
        ) : cheapest ? (
          <>
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper-ink/50">
              From
            </span>
            <span className="font-mono text-lg font-semibold text-paper-ink">
              ${cheapest.price}
            </span>
          </>
        ) : (
          <span className="font-mono text-xs text-paper-ink/50">—</span>
        )}
      </div>
    </Link>
  );
}
