import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    client
      .get("/events", { params: { mine: 1 } })
      .then((res) => {
        setEvents(res.data.data ?? res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Organizer</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-stub">Your Events</h1>
        </div>
        <Link to="/organizer/events/new" className="btn-primary">
          + New event
        </Link>
      </div>

      {status === "loading" && <p className="mt-8 font-mono text-sm text-mist">Loading…</p>}
      {status === "ready" && events.length === 0 && (
        <p className="mt-8 text-mist">You haven't created any events yet.</p>
      )}

      <div className="mt-8 divide-y divide-stub/10 border-y border-stub/10">
        {events.map((e) => (
          <Link
            key={e.id}
            to={`/organizer/events/${e.slug}/edit`}
            className="flex items-center justify-between gap-4 py-4 transition hover:bg-ink-soft"
          >
            <div>
              <p className="font-display text-lg font-medium text-stub">{e.title}</p>
              <p className="font-mono text-xs text-mist">
                {new Date(e.starts_at).toLocaleString()} · {e.venue}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wide ${
                e.status === "published"
                  ? "bg-marquee/15 text-marquee"
                  : e.status === "cancelled"
                  ? "bg-velvet/15 text-velvet"
                  : "bg-mist/15 text-mist"
              }`}
            >
              {e.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
