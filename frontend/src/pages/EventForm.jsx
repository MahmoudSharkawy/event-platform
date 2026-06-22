import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

const emptyTicketType = { name: "", price_cents: 0, quantity_total: 50 };

function toDatetimeLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EventForm() {
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    address: "",
    starts_at: "",
    ends_at: "",
    status: "draft",
  });
  const [ticketTypes, setTicketTypes] = useState([{ ...emptyTicketType }]);
  const [existingEvent, setExistingEvent] = useState(null);
  const [newTicketType, setNewTicketType] = useState({ ...emptyTicketType });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    client.get(`/events/${slug}`).then((res) => {
      const e = res.data.data ?? res.data;
      setExistingEvent(e);
      setForm({
        title: e.title,
        description: e.description || "",
        venue: e.venue,
        address: e.address || "",
        starts_at: toDatetimeLocal(e.starts_at),
        ends_at: toDatetimeLocal(e.ends_at),
        status: e.status,
      });
    });
  }, [slug, isEditing]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isEditing) {
        await client.put(`/events/${slug}`, form);
      } else {
        await client.post("/events", {
          ...form,
          ticket_types: ticketTypes.filter((t) => t.name),
        });
      }
      navigate("/organizer/events");
    } catch (err) {
      const messages = err.response?.data?.errors;
      setError(
        messages
          ? Object.values(messages).flat().join(" ")
          : "Couldn't save that event. Check the fields and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function addTicketTypeToExisting() {
    if (!newTicketType.name) return;
    const res = await client.post(`/events/${slug}/ticket-types`, newTicketType);
    setExistingEvent({
      ...existingEvent,
      ticket_types: [...existingEvent.ticket_types, res.data.data ?? res.data],
    });
    setNewTicketType({ ...emptyTicketType });
  }

  async function deleteTicketType(ticketTypeId) {
    await client.delete(`/events/${slug}/ticket-types/${ticketTypeId}`);
    setExistingEvent({
      ...existingEvent,
      ticket_types: existingEvent.ticket_types.filter((t) => t.id !== ticketTypeId),
    });
  }

  function updateNewTicketType(index, field, value) {
    const next = [...ticketTypes];
    next[index] = { ...next[index], [field]: value };
    setTicketTypes(next);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">
        {isEditing ? "Edit event" : "New event"}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-stub">
        {isEditing ? form.title || "Edit event" : "Create an event"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Description">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue">
            <input
              required
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Address">
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Starts at">
            <input
              type="datetime-local"
              required
              value={form.starts_at}
              onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Ends at">
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              className="input"
            />
          </Field>
        </div>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="input"
          >
            <option value="draft">Draft — hidden from the public</option>
            <option value="published">Published — open for booking</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>

        {!isEditing && (
          <div className="rounded-lg border border-stub/10 p-4">
            <p className="text-xs uppercase tracking-wide text-mist">Ticket types</p>
            <div className="mt-3 space-y-3">
              {ticketTypes.map((tt, i) => (
                <div key={i} className="grid grid-cols-[1fr,100px,100px] gap-2">
                  <input
                    placeholder="Name (e.g. General)"
                    value={tt.name}
                    onChange={(e) => updateNewTicketType(i, "name", e.target.value)}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Price ¢"
                    value={tt.price_cents}
                    onChange={(e) => updateNewTicketType(i, "price_cents", Number(e.target.value))}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={tt.quantity_total}
                    onChange={(e) =>
                      updateNewTicketType(i, "quantity_total", Number(e.target.value))
                    }
                    className="input"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTicketTypes([...ticketTypes, { ...emptyTicketType }])}
              className="mt-3 font-mono text-xs uppercase tracking-wide text-marquee hover:underline"
            >
              + Add another ticket type
            </button>
            <p className="mt-2 text-[11px] text-mist">Price is in cents (e.g. 2500 = $25.00).</p>
          </div>
        )}

        {error && <p className="text-sm text-velvet">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Saving…" : isEditing ? "Save changes" : "Create event"}
        </button>
      </form>

      {isEditing && existingEvent && (
        <div className="mt-10 border-t border-stub/10 pt-8">
          <p className="text-xs uppercase tracking-wide text-mist">Ticket types</p>
          <div className="mt-3 space-y-2">
            {existingEvent.ticket_types.map((tt) => (
              <div
                key={tt.id}
                className="flex items-center justify-between rounded-lg border border-stub/10 px-3 py-2 text-sm"
              >
                <span>
                  {tt.name} — ${tt.price} ({tt.quantity_available}/{tt.quantity_total} left)
                </span>
                <button
                  onClick={() => deleteTicketType(tt.id)}
                  className="font-mono text-xs uppercase text-velvet hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-[1fr,100px,100px,auto] gap-2">
            <input
              placeholder="Name"
              value={newTicketType.name}
              onChange={(e) => setNewTicketType({ ...newTicketType, name: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Price ¢"
              value={newTicketType.price_cents}
              onChange={(e) =>
                setNewTicketType({ ...newTicketType, price_cents: Number(e.target.value) })
              }
              className="input"
            />
            <input
              type="number"
              placeholder="Qty"
              value={newTicketType.quantity_total}
              onChange={(e) =>
                setNewTicketType({ ...newTicketType, quantity_total: Number(e.target.value) })
              }
              className="input"
            />
            <button type="button" onClick={addTicketTypeToExisting} className="btn-secondary">
              Add
            </button>
          </div>
        </div>
      )}
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
