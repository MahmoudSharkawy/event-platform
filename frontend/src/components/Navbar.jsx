import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isOrganizer, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-stub/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-stub">
            Event Ticketing
          </span>
        </Link>

        <nav className="flex items-center gap-5 font-body text-sm text-mist">
          <Link to="/" className="transition hover:text-stub">
            Events
          </Link>

          {user && (
            <Link to="/my-bookings" className="transition hover:text-stub">
              My Tickets
            </Link>
          )}

          {isOrganizer && (
            <Link to="/organizer/events" className="transition hover:text-stub">
              Manage Events
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" className="transition hover:text-stub">
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-stub/20 px-4 py-1.5 text-stub transition hover:border-marquee hover:text-marquee"
            >
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="transition hover:text-stub">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-marquee px-4 py-1.5 font-medium text-ink transition hover:bg-marquee-soft"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
