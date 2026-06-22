import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import EventCard from "../components/EventCard";

// ─── data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "All",         value: "",           icon: "✦" },
  { label: "Music",       value: "music",      icon: "🎵" },
  { label: "Tech",        value: "tech",       icon: "💡" },
  { label: "Art",         value: "art",        icon: "🎨" },
  { label: "Sports",      value: "sports",     icon: "🏟️" },
  { label: "Food",        value: "food",       icon: "🍽️" },
  { label: "Business",    value: "business",   icon: "📈" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse events",
    body: "Search upcoming events by name or venue, filter by category, and find something that fits your schedule.",
  },
  {
    step: "02",
    title: "Pick your ticket",
    body: "Choose from General Admission, VIP, or any tier the organizer has set up. See availability in real time.",
  },
  {
    step: "03",
    title: "Book in seconds",
    body: "Create a free account, select your quantity, and confirm. Your booking reference arrives instantly by email.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Bought tickets for three shows in one evening. The process was so smooth I almost kept going.",
    name: "Layla M.",
    role: "Regular attendee",
    initials: "LM",
  },
  {
    quote: "We sold out our 300-person launch event in under 48 hours. The organizer dashboard made managing everything painless.",
    name: "Sam K.",
    role: "Event organizer",
    initials: "SK",
  },
  {
    quote: "Finally a ticketing platform that doesn't bury the price in fees at the last step. What you see is what you pay.",
    name: "Priya D.",
    role: "Conference attendee",
    initials: "PD",
  },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function EventsList() {
  const [events, setEvents]       = useState([]);
  const [featured, setFeatured]   = useState(null);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("");
  const [status, setStatus]       = useState("idle");

  // Fetch events whenever search or category changes
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    client
      .get("/events", {
        params: { search: search || undefined, category: category || undefined },
        signal: controller.signal,
      })
      .then((res) => {
        const list = res.data.data ?? res.data;
        setEvents(list);
        // Pin the first bookable event as the hero feature
        setFeatured(list.find((e) => e.is_bookable) ?? list[0] ?? null);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name !== "CanceledError") setStatus("error");
      });
    return () => controller.abort();
  }, [search, category]);

  const listEvents = featured
    ? events.filter((e) => e.id !== featured.id)
    : events;

  return (
    <>
      {/* ── 1. HERO / FEATURED EVENT ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-stub/10 bg-ink-soft">
        {/* Decorative radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[680px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(242,181,68,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          {featured ? (
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {/* Text */}
              <div>
                <span className="inline-block rounded-full border border-marquee/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-marquee">
                  Featured event
                </span>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-stub sm:text-5xl lg:text-6xl">
                  {featured.title}
                </h1>
                <p className="mt-4 text-mist">
                  {featured.venue}
                  {featured.address ? ` · ${featured.address}` : ""}
                </p>
                {featured.description && (
                  <p className="mt-3 line-clamp-3 max-w-lg text-stub/70">
                    {featured.description}
                  </p>
                )}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={`/events/${featured.slug}`} className="btn-primary">
                    Get tickets
                  </Link>
                  <a href="#events" className="btn-secondary">
                    Browse all
                  </a>
                </div>
              </div>

              {/* Ticket-stub card preview */}
              <div className="ticket-stub mx-auto w-full max-w-sm p-7 shadow-2xl shadow-black/50">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-velvet">
                  {featured.starts_at
                    ? new Date(featured.starts_at).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date TBA"}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-paper-ink">
                  {featured.title}
                </p>
                <p className="mt-1 text-sm text-paper-ink/60">{featured.venue}</p>

                <div className="my-5 border-t border-dashed border-paper-ink/20" />

                {featured.ticket_types?.length > 0 ? (
                  <div className="space-y-1">
                    {featured.ticket_types.slice(0, 3).map((tt) => (
                      <div key={tt.id} className="flex items-center justify-between text-sm">
                        <span className="text-paper-ink/70">{tt.name}</span>
                        <span className="font-mono font-medium text-paper-ink">
                          {tt.sold_out ? "Sold out" : `$${tt.price}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-paper-ink/50">Free entry</p>
                )}

                <Link
                  to={`/events/${featured.slug}`}
                  className="mt-5 block w-full rounded-full bg-ink py-2 text-center font-mono text-sm font-medium text-marquee transition hover:bg-ink-soft"
                >
                  View & book →
                </Link>
              </div>
            </div>
          ) : (
            /* No events yet — still show a branded hero */
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">
                Now booking
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-stub sm:text-6xl">
                Find your next<br />night out.
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-mist">
                Live shows, conferences, and meetups — browse what's on and grab a ticket in under
                a minute.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/register" className="btn-primary">Get started free</Link>
                <a href="#events" className="btn-secondary">Browse events</a>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        {/* ── 2. CATEGORY FILTER ────────────────────────────────────────────── */}
        <section id="events" className="pt-12">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wide transition ${
                  category === cat.value
                    ? "border-marquee bg-marquee/10 text-marquee"
                    : "border-stub/15 text-mist hover:border-stub/40 hover:text-stub"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <input
              type="search"
              placeholder="Search by event or venue…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input max-w-sm"
            />
          </div>
        </section>

        {/* ── 3. EVENT GRID ─────────────────────────────────────────────────── */}
        <section className="mt-8 pb-16">
          {status === "loading" && (
            <p className="font-mono text-sm text-mist">Loading events…</p>
          )}
          {status === "error" && (
            <p className="font-mono text-sm text-velvet">
              Couldn't load events. Is the API running?
            </p>
          )}
          {status === "ready" && events.length === 0 && (
            <p className="font-mono text-sm text-mist">No events match that search yet.</p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>

      {/* ── 4. HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="border-y border-stub/10 bg-ink-soft py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Simple process</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-stub sm:text-4xl">
            How it works
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative pl-6">
                {/* Vertical connector line between steps */}
                <div className="absolute left-0 top-2 h-full w-px bg-stub/10 sm:hidden" />
                <p className="font-mono text-4xl font-bold text-stub/8">{item.step}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-stub">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary">Start for free</Link>
            <Link to="/organizer/events/new" className="btn-secondary">Host an event</Link>
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">
            What people say
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-stub sm:text-4xl">
            Loved by attendees & organizers
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-stub/10 bg-ink-soft p-7"
              >
                {/* Quote marks */}
                <p className="font-display text-5xl leading-none text-marquee/30 select-none">"</p>
                <p className="mt-2 text-sm leading-relaxed text-stub/80">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-marquee/15 font-mono text-xs font-semibold text-marquee">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stub">{t.name}</p>
                    <p className="font-mono text-[11px] text-mist">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="border-t border-stub/10 bg-ink-soft py-20">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-display text-3xl font-semibold text-stub sm:text-4xl">
            Ready to find your next event?
          </h2>
          <p className="mt-4 text-mist">
            Join thousands of attendees and organizers already using Marquee.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">Create a free account</Link>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="btn-secondary">
              Browse events
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
