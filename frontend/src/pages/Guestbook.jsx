import { useState } from "react";
import State from "../components/State.jsx";
import { api } from "../api";
import { useFetch } from "../useFetch";

export default function Guestbook() {
  const { data, error, reload } = useFetch("/guestbook", 60000);
  const [form, setForm] = useState({ name: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      await api.post("/guestbook", form);
      setForm({ name: form.name, message: "" });
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Guestbook</h1>
      <form className="card form" onSubmit={submit}>
        <label>
          Your name
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Your wishes for the couple
          <textarea
            required
            rows="4"
            maxLength={1000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        {formError && <p className="notice error">{formError}</p>}
        <button className="button" disabled={busy}>{busy ? "Posting…" : "Leave a message"}</button>
      </form>

      <State data={data} error={error}>
        {data && data.length === 0 && <p className="notice">Be the first to leave a message.</p>}
        {data &&
          data.map((m) => (
            <blockquote className="card message" key={m.id}>
              <p className="prewrap">{m.message}</p>
              <footer>{m.name}</footer>
            </blockquote>
          ))}
      </State>
    </>
  );
}
