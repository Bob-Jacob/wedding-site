import { useState } from "react";
import { api } from "../api";
import { useFetch } from "../useFetch";

const empty = {
  name: "",
  email: "",
  attending: true,
  party_size: 1,
  meal_choice: "",
  dietary_notes: "",
  message: "",
  invite_code: "",
};

export default function Rsvp() {
  const { data: info } = useFetch("/info");
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  const meals = info ? info.meal_options.split(",").map((m) => m.trim()).filter(Boolean) : [];
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.post("/rsvp", { ...form, party_size: Number(form.party_size) });
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <section className="card center">
        <h1>Thank you!</h1>
        <p>{form.attending ? "We can't wait to celebrate with you." : "We'll miss you, thank you for letting us know."}</p>
        <button className="button secondary" onClick={() => { setForm(empty); setStatus("idle"); }}>
          Submit another RSVP
        </button>
      </section>
    );
  }

  return (
    <>
      <h1>RSVP</h1>
      <form className="card form" onSubmit={submit}>
        <label>
          Your name
          <input required value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label>
          Email (optional)
          <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
        </label>
        <label>
          Invite code (optional, if you were given one)
          <input value={form.invite_code} onChange={set("invite_code")} maxLength={12} />
        </label>

        <fieldset>
          <legend>Will you be joining us?</legend>
          <label className="inline">
            <input type="radio" checked={form.attending} onChange={() => setForm({ ...form, attending: true })} /> Joyfully accept
          </label>
          <label className="inline">
            <input type="radio" checked={!form.attending} onChange={() => setForm({ ...form, attending: false })} /> Regretfully decline
          </label>
        </fieldset>

        {form.attending && (
          <>
            <label>
              Number of guests (including you)
              <input type="number" min="1" max="10" value={form.party_size} onChange={set("party_size")} />
            </label>
            {meals.length > 0 && (
              <label>
                Meal choice
                <select value={form.meal_choice} onChange={set("meal_choice")}>
                  <option value="">Select…</option>
                  {meals.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Dietary needs or allergies
              <input value={form.dietary_notes} onChange={set("dietary_notes")} maxLength={300} />
            </label>
          </>
        )}

        <label>
          A message for the couple (optional)
          <textarea rows="3" value={form.message} onChange={set("message")} maxLength={1000} />
        </label>

        {error && <p className="notice error">{error}</p>}
        <button className="button" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send RSVP"}
        </button>
      </form>
    </>
  );
}
