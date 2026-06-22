import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-stub/10 bg-ink-soft">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-xl font-semibold text-stub">Marquee</span>
            <p className="mt-2 text-sm leading-relaxed text-mist">
              The easiest way to discover events and grab tickets — no hidden fees, no fuss.
            </p>
          </div>

          {/* Discover */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-marquee">
              Discover
            </p>
            <ul className="mt-4 space-y-2 text-sm text-mist">
              <li><Link to="/" className="transition hover:text-stub">Browse events</Link></li>
              <li><Link to="/register" className="transition hover:text-stub">Create account</Link></li>
              <li><Link to="/my-bookings" className="transition hover:text-stub">My tickets</Link></li>
            </ul>
          </div>

          {/* Organizers */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-marquee">
              Organizers
            </p>
            <ul className="mt-4 space-y-2 text-sm text-mist">
              <li>
                <Link to="/register" className="transition hover:text-stub">
                  Host an event
                </Link>
              </li>
              <li>
                <Link to="/organizer/events" className="transition hover:text-stub">
                  Manage events
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-marquee">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm text-mist">
              <li><a href="#" className="transition hover:text-stub">About</a></li>
              <li><a href="#" className="transition hover:text-stub">Contact</a></li>
              <li><a href="#" className="transition hover:text-stub">Privacy policy</a></li>
              <li><a href="#" className="transition hover:text-stub">Terms of service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stub/10 pt-8 sm:flex-row">
          <p className="font-mono text-xs text-mist">
            © {new Date().getFullYear()} Marquee. All rights reserved.
          </p>
          <div className="flex gap-5 font-mono text-xs text-mist">
            <a href="#" className="transition hover:text-stub">Twitter / X</a>
            <a href="#" className="transition hover:text-stub">Instagram</a>
            <a href="#" className="transition hover:text-stub">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
