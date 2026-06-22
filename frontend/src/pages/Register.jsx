import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "attendee",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const messages = err.response?.data?.errors;
      setError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Couldn't create your account. Please check your details."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">Get started</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-stub">Create an account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </Field>
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
        <Field label="Confirm password">
          <input
            type="password"
            required
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="I'm signing up as">
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input"
          >
            <option value="attendee">Attendee — booking tickets</option>
            <option value="organizer">Organizer — hosting events</option>
          </select>
        </Field>

        {error && <p className="text-sm text-velvet">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-mist">
        Already have an account?{" "}
        <Link to="/login" className="text-marquee hover:text-marquee-soft">
          Log in
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
