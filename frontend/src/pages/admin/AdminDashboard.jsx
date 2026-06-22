import { useEffect, useState } from "react";
import client from "../../api/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    client
      .get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return <p className="px-5 py-16 font-mono text-sm text-mist">Loading dashboard…</p>;
  }
  if (status === "error" || !stats) {
    return <p className="px-5 py-16 font-mono text-sm text-velvet">Couldn't load admin data.</p>;
  }

  const cards = [
    { label: "Total users", value: stats.totals.users },
    { label: "Events", value: stats.totals.events },
    { label: "Published events", value: stats.totals.published_events },
    { label: "Confirmed bookings", value: stats.totals.bookings },
    { label: "Revenue", value: `$${stats.totals.revenue}` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-stub">Overview</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-stub/10 p-4">
            <p className="font-mono text-2xl font-semibold text-marquee">{c.value}</p>
            <p className="mt-1 text-xs text-mist">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold text-stub">Recent bookings</h2>
      <div className="mt-4 divide-y divide-stub/10 border-y border-stub/10">
        {stats.recent_bookings.map((b) => (
          <div key={b.id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="text-stub">{b.event?.title}</p>
              <p className="font-mono text-xs text-mist">
                {b.ticket_type?.name} × {b.quantity} · Ref {b.reference}
              </p>
            </div>
            <span className="font-mono text-stub">${b.total_price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
