import { useState } from "react";
import { api } from "../api";

export default function Songs() {
  const [form, setForm] = useState({ guest_name: "", song: "", artist: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.post("/songs", form);
      setForm({ ...form, song: "", artist: "" });
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <>
      <h1>Song requests</h1>
      <p className="muted">What will get you on the dance floor? Tell the DJ.</p>
      <form className="card form" onSubmit={submit}>
        <label>
          Your name (optional)
          <input value={form.guest_name} onChange={set("guest_name")} />
        </label>
        <label>
          Song
          <input required value={form.song} onChange={set("song")} />
        </label>
        <label>
          Artist
          <input value={form.artist} onChange={set("artist")} />
        </label>
        {status === "done" && <p className="notice">Added to the list. Thank you!</p>}
        {error && <p className="notice error">{error}</p>}
        <button className="button" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request song"}
        </button>
      </form>
    </>
  );
}
