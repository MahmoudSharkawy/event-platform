import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@example.com", password: "password", color: "text-velvet" },
  { label: "Organizer", email: "organizer@example.com", password: "password", color: "text-marquee" },
  { label: "Attendee", email: "attendee@example.com", password: "password", color: "text-mist" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't log you in. Check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoLogin(account) {
    setError("");
    setForm({ email: account.email, password: account.password });
    setSubmitting(true);
    try {
      await login(account.email, account.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError("Demo login failed — make sure the backend is running and seeded.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-stub">Log in</h1>

      {/* Demo accounts */}
      <div className="mt-6 rounded-xl border border-stub/10 bg-ink-soft p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
          Demo accounts — click to log in instantly
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              disabled={submitting}
              onClick={() => handleDemoLogin(account)}
              className="flex items-center justify-between rounded-lg border border-stub/10 px-3 py-2 text-left transition hover:border-stub/30 hover:bg-ink disabled:opacity-50"
            >
              <div>
                <span className={`font-mono text-xs font-semibold uppercase tracking-wide ${account.color}`}>
                  {account.label}
                </span>
                <p className="mt-0.5 font-mono text-[11px] text-mist">{account.email}</p>
              </div>
              <span className="font-mono text-xs text-mist">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stub/10" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-mist">or log in manually</span>
        <div className="h-px flex-1 bg-stub/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
          />
        </Field>

        {error && <p className="text-sm text-velvet">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-mist">
        New here?{" "}
        <Link to="/register" className="text-marquee hover:text-marquee-soft">
          Create an account
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-mist">{label}</span>
      {children}
    </label>
  );
}
