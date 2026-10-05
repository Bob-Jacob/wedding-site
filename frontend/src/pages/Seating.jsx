import { useState } from "react";
import { api } from "../api";

export default function Seating() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  async function search(e) {
    e.preventDefault();
    setError("");
    try {
      setResults(await api.get(`/seating?name=${encodeURIComponent(query.trim())}`));
    } catch {
      setResults(null);
      setError("Please type at least two letters of your name.");
    }
  }

  return (
    <>
      <h1>Find your seat</h1>
      <form className="card form" onSubmit={search}>
        <label>
          Your name
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Jane" required />
        </label>
        <button className="button">Find my table</button>
      </form>

      {error && <p className="notice error">{error}</p>}
      {results && results.length === 0 && (
        <p className="notice">We couldn't find that name. Try just your first or last name, or ask us on the day.</p>
      )}
      {results &&
        results.map((guest, i) => (
          <section className="card seat" key={`${guest.name}-${i}`}>
            <h3>{guest.name}</h3>
            {guest.table_number ? (
              <p className="table-number">
                Table {guest.table_number}
                {guest.table_name && <span> · {guest.table_name}</span>}
              </p>
            ) : (
              <p className="muted">Seating isn't assigned yet.</p>
            )}
          </section>
        ))}
    </>
  );
}
